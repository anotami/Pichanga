import streamlit as st
import psycopg2
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

st.set_page_config(
    page_title="Pichanga Admin",
    page_icon="⚽",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.markdown("""
<style>
    .metric-card { background: #fff; border-radius: 12px; padding: 16px; border: 1px solid #f0f0f0; }
    .stMetric { background: white; border-radius: 12px; padding: 12px; border: 1px solid #f0f0f0; }
</style>
""", unsafe_allow_html=True)

@st.cache_resource
def get_conn():
    db_url = os.getenv("DATABASE_URL") or st.secrets.get("DATABASE_URL", "")
    return psycopg2.connect(db_url)

def query(sql, params=None):
    try:
        conn = get_conn()
        return pd.read_sql_query(sql, conn, params=params)
    except Exception as e:
        st.error(f"Error DB: {e}")
        return pd.DataFrame()

def execute(sql, params=None):
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(sql, params)
        conn.commit()
        return True
    except Exception as e:
        st.error(f"Error: {e}")
        return False

# ─── Sidebar ───────────────────────────────────────────────────────────────────
st.sidebar.markdown("# ⚽ Pichanga Admin")
st.sidebar.markdown("Panel de administración")
pagina = st.sidebar.radio("Sección", [
    "📊 Dashboard",
    "👟 Jugadores",
    "⚽ Partidos",
    "🚨 Strikes y Baneos",
    "💰 Transacciones",
    "🏟️ Clubes",
])
st.sidebar.markdown("---")
st.sidebar.markdown(f"*Actualizado: {datetime.now().strftime('%d/%m/%Y %H:%M')}*")

# ─── Dashboard ─────────────────────────────────────────────────────────────────
if pagina == "📊 Dashboard":
    st.title("📊 Dashboard General")

    col1, col2, col3, col4 = st.columns(4)

    total_usuarios = query("SELECT COUNT(*) as n FROM \"Usuario\"").iloc[0]['n']
    total_jugadores = query("SELECT COUNT(*) as n FROM \"Usuario\" WHERE tipo='JUGADOR'").iloc[0]['n']
    total_partidos = query("SELECT COUNT(*) as n FROM \"Partido\"").iloc[0]['n']
    partidos_abiertos = query("SELECT COUNT(*) as n FROM \"Partido\" WHERE status='ABIERTO'").iloc[0]['n']

    col1.metric("👥 Usuarios totales", int(total_usuarios))
    col2.metric("👟 Jugadores", int(total_jugadores))
    col3.metric("⚽ Partidos totales", int(total_partidos))
    col4.metric("🟢 Partidos abiertos", int(partidos_abiertos))

    st.markdown("---")
    col_a, col_b = st.columns(2)

    with col_a:
        st.subheader("Registros por tipo")
        df_tipos = query("SELECT tipo, COUNT(*) as cantidad FROM \"Usuario\" GROUP BY tipo")
        if not df_tipos.empty:
            fig = px.pie(df_tipos, values='cantidad', names='tipo',
                        color_discrete_sequence=['#dc2626', '#16a34a', '#2563eb'])
            st.plotly_chart(fig, use_container_width=True)

    with col_b:
        st.subheader("Partidos por distrito (Top 10)")
        df_dist = query("""
            SELECT distrito, COUNT(*) as partidos
            FROM \"Partido\" GROUP BY distrito
            ORDER BY partidos DESC LIMIT 10
        """)
        if not df_dist.empty:
            fig = px.bar(df_dist, x='partidos', y='distrito', orientation='h',
                        color_discrete_sequence=['#dc2626'])
            fig.update_layout(yaxis={'categoryorder': 'total ascending'})
            st.plotly_chart(fig, use_container_width=True)

    st.subheader("Jugadores por posición")
    df_pos = query("""
        SELECT posicion, COUNT(*) as cantidad, AVG(rating) as rating_prom, AVG(precio) as precio_prom
        FROM \"JugadorPerfil\" GROUP BY posicion
    """)
    if not df_pos.empty:
        df_pos['rating_prom'] = df_pos['rating_prom'].round(2)
        df_pos['precio_prom'] = df_pos['precio_prom'].round(2)
        st.dataframe(df_pos, use_container_width=True)

    st.subheader("Ingresos de la plataforma")
    df_ingresos = query("""
        SELECT DATE_TRUNC('day', "createdAt") as dia, SUM(comision) as comision_total
        FROM \"Transaccion\" WHERE status='PAGADO'
        GROUP BY dia ORDER BY dia
    """)
    if not df_ingresos.empty:
        fig = px.line(df_ingresos, x='dia', y='comision_total',
                     title='Comisiones diarias (S/)',
                     color_discrete_sequence=['#dc2626'])
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("Aún no hay transacciones pagadas")

# ─── Jugadores ─────────────────────────────────────────────────────────────────
elif pagina == "👟 Jugadores":
    st.title("👟 Gestión de Jugadores")

    col1, col2, col3 = st.columns(3)
    filtro_pos = col1.selectbox("Posición", ["Todas", "ARQUERO", "DEFENSA", "MEDIOCAMPISTA", "DELANTERO"])
    filtro_nivel = col2.selectbox("Nivel", ["Todos", "AMATEUR", "INTERMEDIO", "COMPETITIVO"])
    filtro_ban = col3.selectbox("Estado", ["Todos", "Activos", "Baneados"])

    where_clauses = ["u.tipo = 'JUGADOR'"]
    if filtro_pos != "Todas":
        where_clauses.append(f"jp.posicion = '{filtro_pos}'")
    if filtro_nivel != "Todos":
        where_clauses.append(f"jp.nivel = '{filtro_nivel}'")
    if filtro_ban == "Baneados":
        where_clauses.append("u.\"baneoHasta\" > NOW()")
    elif filtro_ban == "Activos":
        where_clauses.append("(u.\"baneoHasta\" IS NULL OR u.\"baneoHasta\" < NOW())")

    where_sql = " AND ".join(where_clauses)
    df_jugadores = query(f"""
        SELECT u.id, u.nombre, u.email, u.telefono,
               jp.posicion, jp.nivel, jp.distrito, jp.precio,
               jp.rating, jp.puntos, jp."totalPartidos", jp."totalResenas",
               u."totalStrikes", u."baneoHasta", u."createdAt"
        FROM \"Usuario\" u
        LEFT JOIN \"JugadorPerfil\" jp ON u.id = jp."usuarioId"
        WHERE {where_sql}
        ORDER BY jp.rating DESC NULLS LAST
    """)

    st.markdown(f"**{len(df_jugadores)} jugadores encontrados**")
    st.dataframe(df_jugadores, use_container_width=True)

    st.markdown("---")
    st.subheader("🚫 Gestión de baneos")
    col_ban1, col_ban2, col_ban3 = st.columns(3)
    user_id = col_ban1.text_input("ID del usuario")
    dias = col_ban2.number_input("Días de baneo", min_value=1, max_value=365, value=7)
    if col_ban3.button("Aplicar baneo manual") and user_id:
        hasta = datetime.now() + timedelta(days=dias)
        if execute(f"UPDATE \"Usuario\" SET \"baneoHasta\" = %s WHERE id = %s", (hasta, user_id)):
            st.success(f"Usuario baneado hasta {hasta.strftime('%d/%m/%Y')}")

    if st.button("Levantar baneo") and user_id:
        if execute("UPDATE \"Usuario\" SET \"baneoHasta\" = NULL, \"totalStrikes\" = 0 WHERE id = %s", (user_id,)):
            st.success("Baneo levantado")

# ─── Partidos ──────────────────────────────────────────────────────────────────
elif pagina == "⚽ Partidos":
    st.title("⚽ Gestión de Partidos")

    df_partidos = query("""
        SELECT p.id, p.titulo, p.distrito, p.modalidad, p."nivelRequerido",
               p.status, p.fecha, p.destacado,
               u.nombre as organizador,
               COUNT(DISTINCT s.id) as solicitudes
        FROM \"Partido\" p
        LEFT JOIN \"Usuario\" u ON p."organizadorId" = u.id
        LEFT JOIN \"Solicitud\" s ON p.id = s."partidoId"
        GROUP BY p.id, u.nombre
        ORDER BY p."createdAt" DESC
        LIMIT 100
    """)

    col1, col2 = st.columns(2)
    filtro_status = col1.selectbox("Status", ["Todos", "ABIERTO", "COMPLETADO", "CANCELADO"])
    filtro_dest = col2.checkbox("Solo destacados")

    df_show = df_partidos.copy()
    if filtro_status != "Todos":
        df_show = df_show[df_show['status'] == filtro_status]
    if filtro_dest:
        df_show = df_show[df_show['destacado'] == True]

    st.dataframe(df_show, use_container_width=True)

    st.markdown("---")
    st.subheader("Estadísticas de partidos")
    col_a, col_b = st.columns(2)
    with col_a:
        df_status = query("SELECT status, COUNT(*) as n FROM \"Partido\" GROUP BY status")
        if not df_status.empty:
            fig = px.pie(df_status, values='n', names='status', title='Por status',
                        color_discrete_sequence=['#16a34a', '#dc2626', '#2563eb', '#gray'])
            st.plotly_chart(fig, use_container_width=True)
    with col_b:
        df_mod = query("SELECT modalidad, COUNT(*) as n FROM \"Partido\" GROUP BY modalidad")
        if not df_mod.empty:
            fig = px.bar(df_mod, x='modalidad', y='n', title='Por modalidad',
                        color_discrete_sequence=['#dc2626'])
            st.plotly_chart(fig, use_container_width=True)

# ─── Strikes ───────────────────────────────────────────────────────────────────
elif pagina == "🚨 Strikes y Baneos":
    st.title("🚨 Strikes y Baneos")

    df_strikes = query("""
        SELECT s.id, s.tipo, s.descripcion, s."baneoAplicado", s."createdAt",
               uj.nombre as jugador, ur.nombre as reportado_por,
               p.titulo as partido
        FROM \"Strike\" s
        JOIN \"Usuario\" uj ON s."jugadorId" = uj.id
        JOIN \"Usuario\" ur ON s."reportadoPorId" = ur.id
        JOIN \"Partido\" p ON s."partidoId" = p.id
        ORDER BY s."createdAt" DESC
    """)
    st.dataframe(df_strikes, use_container_width=True)

    st.markdown("---")
    st.subheader("Usuarios actualmente baneados")
    df_baneados = query("""
        SELECT u.nombre, u.email, u."baneoHasta", u."totalStrikes",
               jp.posicion, jp.distrito
        FROM \"Usuario\" u
        LEFT JOIN \"JugadorPerfil\" jp ON u.id = jp."usuarioId"
        WHERE u."baneoHasta" > NOW()
        ORDER BY u."baneoHasta" DESC
    """)
    if df_baneados.empty:
        st.success("No hay usuarios baneados actualmente")
    else:
        st.warning(f"{len(df_baneados)} usuarios baneados")
        st.dataframe(df_baneados, use_container_width=True)

# ─── Transacciones ─────────────────────────────────────────────────────────────
elif pagina == "💰 Transacciones":
    st.title("💰 Auditoría de Pagos")

    df_tx = query("""
        SELECT t.id, t.monto, t.comision, t.neto, t.tipo, t.status, t."createdAt",
               u.nombre as jugador, p.titulo as partido
        FROM \"Transaccion\" t
        JOIN \"Usuario\" u ON t."jugadorId" = u.id
        JOIN \"Partido\" p ON t."partidoId" = p.id
        ORDER BY t."createdAt" DESC
        LIMIT 200
    """)

    col1, col2, col3 = st.columns(3)
    total_comision = df_tx[df_tx['status'] == 'PAGADO']['comision'].sum() if not df_tx.empty else 0
    total_volumen = df_tx[df_tx['status'] == 'PAGADO']['monto'].sum() if not df_tx.empty else 0
    total_tx = len(df_tx)

    col1.metric("💰 Comisiones cobradas", f"S/ {total_comision:.2f}")
    col2.metric("📊 Volumen total", f"S/ {total_volumen:.2f}")
    col3.metric("📋 Total transacciones", total_tx)

    st.dataframe(df_tx, use_container_width=True)

    st.markdown("---")
    st.subheader("Alertas destacadas pagadas")
    df_alertas = query("""
        SELECT a."createdAt", a.monto, a.pagado, p.titulo, p.distrito
        FROM \"AlertaDestacada\" a
        JOIN \"Partido\" p ON a."partidoId" = p.id
        ORDER BY a."createdAt" DESC
    """)
    if df_alertas.empty:
        st.info("No hay alertas destacadas aún")
    else:
        total_alertas = df_alertas[df_alertas['pagado'] == True]['monto'].sum()
        st.metric("Ingresos por alertas", f"S/ {total_alertas:.2f}")
        st.dataframe(df_alertas, use_container_width=True)

# ─── Clubes ────────────────────────────────────────────────────────────────────
elif pagina == "🏟️ Clubes":
    st.title("🏟️ Clubes Asociados")

    df_clubes = query("""
        SELECT c.nombre, c.distrito, c.telefono, c."createdAt",
               u.email, u.nombre as contacto,
               COUNT(DISTINCT p.id) as partidos_org
        FROM \"Club\" c
        JOIN \"Usuario\" u ON c."usuarioId" = u.id
        LEFT JOIN \"Partido\" p ON c.id = p."clubId"
        GROUP BY c.id, u.email, u.nombre
        ORDER BY partidos_org DESC
    """)
    st.dataframe(df_clubes, use_container_width=True)
