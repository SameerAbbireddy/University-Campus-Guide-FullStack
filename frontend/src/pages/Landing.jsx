function Landing({ setScreen }) {
  const styles = {
    page: {
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #f8fafc 0%, #eef2ff 48%, #ffffff 100%)",
      fontFamily:
        "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: "#0f172a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      position: "relative",
      overflow: "hidden",
    },

    blob1: {
      position: "absolute",
      top: "-120px",
      right: "-100px",
      width: "360px",
      height: "360px",
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(124,58,237,0.12), transparent 72%)",
      pointerEvents: "none",
    },

    blob2: {
      position: "absolute",
      bottom: "-160px",
      left: "-120px",
      width: "420px",
      height: "420px",
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(59,130,246,0.10), transparent 72%)",
      pointerEvents: "none",
    },

    wrapper: {
      width: "100%",
      maxWidth: "1240px",
      display: "grid",
      gridTemplateColumns: "1.05fr 0.95fr",
      gap: "48px",
      alignItems: "center",
      position: "relative",
      zIndex: 2,
    },

    left: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },

    eyebrow: {
      display: "inline-block",
      width: "fit-content",
      background: "#ede9fe",
      color: "#6d28d9",
      padding: "9px 16px",
      borderRadius: "999px",
      fontSize: "13px",
      fontWeight: "700",
      letterSpacing: "0.4px",
      marginBottom: "22px",
      boxShadow: "0 8px 18px rgba(109, 40, 217, 0.08)",
    },

    title: {
      fontSize: "76px",
      lineHeight: "1.02",
      margin: "0 0 18px 0",
      fontWeight: "800",
      letterSpacing: "-2.2px",
      color: "#0f172a",
    },

    subtitle: {
      fontSize: "20px",
      lineHeight: "1.8",
      color: "#475569",
      maxWidth: "690px",
      margin: "0 0 34px 0",
    },

    buttonRow: {
      display: "flex",
      gap: "16px",
      flexWrap: "wrap",
      marginBottom: "36px",
    },

    primaryBtn: {
      background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
      color: "#ffffff",
      border: "none",
      padding: "16px 30px",
      borderRadius: "16px",
      fontSize: "16px",
      fontWeight: "700",
      cursor: "pointer",
      minWidth: "210px",
      boxShadow: "0 16px 35px rgba(124, 58, 237, 0.28)",
      transition: "all 0.22s ease",
    },

    secondaryBtn: {
      background: "#ffffff",
      color: "#0f172a",
      border: "1px solid #dbe4f0",
      padding: "16px 30px",
      borderRadius: "16px",
      fontSize: "16px",
      fontWeight: "700",
      cursor: "pointer",
      minWidth: "210px",
      boxShadow: "0 12px 28px rgba(15, 23, 42, 0.06)",
      transition: "all 0.22s ease",
    },

    features: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "16px",
    },

    featureCard: {
      background: "rgba(255,255,255,0.82)",
      border: "1px solid #e2e8f0",
      borderRadius: "22px",
      padding: "22px",
      boxShadow: "0 14px 35px rgba(15, 23, 42, 0.06)",
      transition: "all 0.22s ease",
      backdropFilter: "blur(10px)",
    },

    featureTitle: {
      margin: "0 0 10px 0",
      fontSize: "18px",
      fontWeight: "700",
      color: "#0f172a",
    },

    featureText: {
      margin: 0,
      color: "#64748b",
      lineHeight: "1.7",
      fontSize: "14px",
    },

    right: {
      position: "relative",
      minHeight: "650px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    previewShell: {
      width: "100%",
      maxWidth: "570px",
      background: "rgba(255,255,255,0.82)",
      border: "1px solid #e2e8f0",
      borderRadius: "34px",
      boxShadow: "0 28px 70px rgba(15, 23, 42, 0.10)",
      padding: "22px",
      backdropFilter: "blur(12px)",
    },

    previewWindow: {
      background: "#ffffff",
      border: "1px solid #edf2f7",
      borderRadius: "28px",
      padding: "18px",
      boxShadow: "0 16px 34px rgba(15, 23, 42, 0.05)",
    },

    previewTop: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      marginBottom: "14px",
    },

    dots: {
      display: "flex",
      gap: "8px",
    },

    dot: (color) => ({
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      background: color,
    }),

    searchBar: {
      height: "52px",
      borderRadius: "16px",
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      display: "flex",
      alignItems: "center",
      padding: "0 16px",
      color: "#64748b",
      fontSize: "14px",
      fontWeight: "500",
      marginBottom: "14px",
    },

    chipRow: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
      marginBottom: "16px",
    },

    chip: {
      padding: "8px 12px",
      borderRadius: "999px",
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      color: "#475569",
      fontSize: "12px",
      fontWeight: "700",
    },

    activeChip: {
      padding: "8px 12px",
      borderRadius: "999px",
      background: "#ede9fe",
      border: "1px solid #ddd6fe",
      color: "#6d28d9",
      fontSize: "12px",
      fontWeight: "700",
    },

    previewGrid: {
      display: "grid",
      gridTemplateColumns: "1.05fr 0.95fr",
      gap: "14px",
      alignItems: "stretch",
    },

    leftPanel: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },

    placeCard: {
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "18px",
      padding: "14px",
      boxShadow: "0 10px 22px rgba(15, 23, 42, 0.04)",
    },

    placeTag: {
      display: "inline-block",
      padding: "6px 10px",
      borderRadius: "999px",
      background: "#f8fafc",
      color: "#64748b",
      fontSize: "11px",
      fontWeight: "700",
      marginBottom: "10px",
    },

    placeName: {
      margin: "0 0 6px 0",
      fontSize: "15px",
      fontWeight: "700",
      color: "#0f172a",
    },

    placeMeta: {
      margin: 0,
      fontSize: "12px",
      lineHeight: "1.6",
      color: "#64748b",
    },

    mapPanel: {
      background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
      border: "1px solid #e2e8f0",
      borderRadius: "22px",
      padding: "14px",
      minHeight: "340px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      position: "relative",
      overflow: "hidden",
    },

    miniMap: {
      position: "relative",
      flex: 1,
      borderRadius: "18px",
      background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
      border: "1px solid #e2e8f0",
      overflow: "hidden",
      minHeight: "210px",
    },

    road1: {
      position: "absolute",
      left: "24px",
      right: "24px",
      top: "86px",
      height: "14px",
      background: "#dbe4f0",
      borderRadius: "999px",
      transform: "rotate(-8deg)",
    },

    road2: {
      position: "absolute",
      left: "122px",
      top: "26px",
      bottom: "26px",
      width: "14px",
      background: "#dbe4f0",
      borderRadius: "999px",
    },

    pin: (top, left) => ({
      position: "absolute",
      top,
      left,
      width: "14px",
      height: "14px",
      borderRadius: "50%",
      background: "#7c3aed",
      boxShadow: "0 0 0 6px rgba(124,58,237,0.14)",
    }),

    selectedPanel: {
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "18px",
      padding: "14px",
      marginTop: "12px",
      boxShadow: "0 10px 22px rgba(15, 23, 42, 0.05)",
    },

    selectedBadge: {
      display: "inline-block",
      padding: "6px 10px",
      borderRadius: "999px",
      background: "#ede9fe",
      color: "#6d28d9",
      fontSize: "11px",
      fontWeight: "700",
      marginBottom: "10px",
    },

    navBtn: {
      display: "inline-block",
      marginTop: "10px",
      background: "#0f172a",
      color: "#ffffff",
      padding: "10px 14px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "700",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div style={styles.wrapper}>
        <div style={styles.left}>
          <div style={styles.eyebrow}>Campus Navigation Platform</div>

          <h1 style={styles.title}>Campus Guide</h1>

          <p style={styles.subtitle}>
            Search campus places, explore facilities, and access directions from
            one clean and intuitive university dashboard.
          </p>

          <div style={styles.buttonRow}>
            <button
              onClick={() => setScreen("login")}
              style={styles.primaryBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                e.currentTarget.style.boxShadow =
                  "0 20px 42px rgba(124, 58, 237, 0.34)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 16px 35px rgba(124, 58, 237, 0.28)";
              }}
            >
              Login
            </button>

            <button
              onClick={() => setScreen("dashboard")}
              style={styles.secondaryBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 18px 34px rgba(15, 23, 42, 0.10)";
                e.currentTarget.style.background = "#f8fafc";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 12px 28px rgba(15, 23, 42, 0.06)";
                e.currentTarget.style.background = "#ffffff";
              }}
            >
              Explore Dashboard
            </button>
          </div>

          <div style={styles.features}>
            {[
              {
                title: "Search Faster",
                text: "Find classrooms, libraries, labs, hostels, and food spots in seconds.",
              },
              {
                title: "Navigate Easily",
                text: "Access directions for important campus locations directly from the dashboard.",
              },
              {
                title: "Stay Informed",
                text: "View essential location details in a clean and organized interface.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={styles.featureCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 18px 38px rgba(15, 23, 42, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 14px 35px rgba(15, 23, 42, 0.06)";
                }}
              >
                <h3 style={styles.featureTitle}>{item.title}</h3>
                <p style={styles.featureText}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.right}>
          <div style={styles.previewShell}>
            <div style={styles.previewWindow}>
              <div style={styles.previewTop}>
                <div style={styles.dots}>
                  <div style={styles.dot("#ef4444")}></div>
                  <div style={styles.dot("#f59e0b")}></div>
                  <div style={styles.dot("#22c55e")}></div>
                </div>
              </div>

              <div style={styles.searchBar}>
                ⌕ Search places, labs, hostels, and canteens...
              </div>

              <div style={styles.chipRow}>
                <div style={styles.activeChip}>All</div>
                <div style={styles.chip}>Canteen</div>
                <div style={styles.chip}>Library</div>
                <div style={styles.chip}>Hostel</div>
              </div>

              <div style={styles.previewGrid}>
                <div style={styles.leftPanel}>
                  <div style={styles.placeCard}>
                    <div style={styles.placeTag}>Canteen</div>
                    <h4 style={styles.placeName}>Main Canteen</h4>
                    <p style={styles.placeMeta}>Popular food spot near Block A</p>
                  </div>

                  <div style={styles.placeCard}>
                    <div style={styles.placeTag}>Library</div>
                    <h4 style={styles.placeName}>Central Library</h4>
                    <p style={styles.placeMeta}>Main study and reference library</p>
                  </div>

                  <div style={styles.placeCard}>
                    <div style={styles.placeTag}>Lab</div>
                    <h4 style={styles.placeName}>Computer Lab 1</h4>
                    <p style={styles.placeMeta}>Programming and DBMS practical lab</p>
                  </div>
                </div>

                <div style={styles.mapPanel}>
                  <div style={styles.miniMap}>
                    <div style={styles.road1}></div>
                    <div style={styles.road2}></div>
                    <div style={styles.pin("58px", "64px")}></div>
                    <div style={styles.pin("108px", "156px")}></div>
                    <div style={styles.pin("162px", "88px")}></div>
                  </div>

                  <div style={styles.selectedPanel}>
                    <div style={styles.selectedBadge}>Location Preview</div>
                    <h4 style={styles.placeName}>Central Library</h4>
                    <p style={styles.placeMeta}>
                      Quiet study space, reading area, and reference section.
                    </p>
                    <div style={styles.navBtn}>View Route</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;