import { useState } from "react";

function Signup({ setScreen }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!name || !email || !password) {
      return "All fields are required";
    }

    if (!email.endsWith("@srmap.edu.in")) {
      return "Email must end with @srmap.edu.in";
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return "Password must be at least 8 characters and include one letter and one number";
    }

    return "";
  };

  const handleSignup = async () => {
    const error = validateForm();
    if (error) {
      setMessage(error);
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userRole", data.role);
      setScreen("dashboard");
    } catch (error) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 45%, #fdfdfd 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "rgba(255,255,255,0.85)",
          border: "1px solid #e2e8f0",
          borderRadius: "28px",
          padding: "36px",
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.09)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "#ede9fe",
            color: "#6d28d9",
            padding: "8px 14px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            marginBottom: "18px",
          }}
        >
          Student Registration
        </div>

        <h1
          style={{
            margin: "0 0 10px 0",
            fontSize: "40px",
            fontWeight: "800",
            color: "#0f172a",
            letterSpacing: "-1px",
          }}
        >
          Create Account
        </h1>

        <p
          style={{
            margin: "0 0 28px 0",
            color: "#64748b",
            lineHeight: "1.7",
            fontSize: "15px",
          }}
        >
          Register with your official SRM AP email to access the campus dashboard.
        </p>

        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="yourname@srmap.edu.in"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Minimum 8 chars, one letter, one number"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {message && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 14px",
              borderRadius: "14px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {message}
          </div>
        )}

        <button onClick={handleSignup} style={primaryButtonStyle} disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <button onClick={() => setScreen("login")} style={secondaryButtonStyle}>
          Already have an account? Login
        </button>

        <button onClick={() => setScreen("landing")} style={secondaryButtonStyle}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "15px 16px",
  borderRadius: "16px",
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
  marginBottom: "16px",
};

const primaryButtonStyle = {
  width: "100%",
  background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
  color: "#ffffff",
  border: "none",
  padding: "15px 18px",
  borderRadius: "16px",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 16px 35px rgba(124, 58, 237, 0.28)",
  marginBottom: "14px",
};

const secondaryButtonStyle = {
  width: "100%",
  background: "#ffffff",
  color: "#0f172a",
  border: "1px solid #cbd5e1",
  padding: "15px 18px",
  borderRadius: "16px",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  marginBottom: "12px",
};

export default Signup;