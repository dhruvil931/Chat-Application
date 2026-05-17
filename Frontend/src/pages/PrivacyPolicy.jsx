import { FaShieldAlt, FaLock, FaDatabase, FaUserSecret } from "react-icons/fa";

export default function PrivacyPolicy() {
  const cards = [
    {
      icon: <FaDatabase />,
      title: "Information We Collect",
      text: "We may collect basic profile information such as your name, email address, and profile picture when signing in with Google or Facebook.",
    },
    {
      icon: <FaLock />,
      title: "Authentication & Security",
      text: "Authentication tokens are securely handled to maintain your session and protect your account from unauthorized access.",
    },
    {
      icon: <FaUserSecret />,
      title: "How Your Data Is Used",
      text: "Your information is used only for authentication, joining chat rooms, and improving the overall application experience.",
    },
    {
      icon: <FaShieldAlt />,
      title: "No Data Selling",
      text: "We do not sell, rent, or share your personal information with third parties for advertising or commercial purposes.",
    },
  ];

  return (
    <div
      className="min-h-screen relative overflow-hidden px-4 py-16 flex justify-center"
      style={{ background: "#07090f" }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #6366f1 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[350px] blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.18), transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-5xl">
        {/* Gradient border */}
        <div
          className="absolute -inset-px rounded-[32px]"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.45), rgba(59,130,246,0.08), rgba(99,102,241,0.25))",
          }}
        />

        {/* Main card */}
        <div
          className="relative rounded-[30px] overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #0e1521 0%, #0a0f1b 100%)",
          }}
        >
          {/* Shine */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(129,140,248,0.5), transparent)",
            }}
          />

          <div className="px-7 md:px-14 py-14">
            {/* Header */}
            <div className="text-center mb-14">
              <div
                className="w-20 h-20 rounded-[24px] mx-auto flex items-center justify-center mb-6"
                style={{
                  background: "linear-gradient(145deg, #1a2540, #111827)",
                  boxShadow:
                    "0 0 0 1px rgba(99,102,241,0.28), 0 12px 40px rgba(99,102,241,0.18)",
                }}
              >
                <FaShieldAlt className="text-indigo-300" size={34} />
              </div>

              <h1
                className="text-4xl md:text-5xl font-bold tracking-tight"
                style={{
                  color: "#eef2ff",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                }}
              >
                Privacy Policy
              </h1>

              <p
                className="mt-4 max-w-2xl mx-auto text-[15px] leading-relaxed"
                style={{ color: "#7c8aa5" }}
              >
                Your privacy matters. This page explains what information we
                collect, why we collect it, and how we protect your data while
                using ChatRooms.
              </p>
            </div>

            {/* Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background:
                      "linear-gradient(160deg, rgba(17,24,39,0.96), rgba(15,23,42,0.92))",
                    border: "1px solid rgba(99,102,241,0.12)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.22)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 text-indigo-300"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(99,102,241,0.22), rgba(59,130,246,0.18))",
                    }}
                  >
                    <span className="text-lg">{card.icon}</span>
                  </div>

                  <h2
                    className="text-xl font-semibold mb-3"
                    style={{ color: "#eef2ff" }}
                  >
                    {card.title}
                  </h2>

                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#7c8aa5" }}
                  >
                    {card.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              className="mt-14 pt-8 border-t text-center"
              style={{ borderColor: "rgba(99,102,241,0.12)" }}
            >
              <p className="text-sm" style={{ color: "#5d6b86" }}>
                By continuing to use ChatRooms, you agree to this privacy policy
                and the secure handling of your authentication data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
