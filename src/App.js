import logo from "./logo.svg";

function App() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        color: "#ffffff",
        margin: "auto",
        justifyContent: "center",
        textAlign: "center",
        height: "100%",
        background:
          "linear-gradient(0deg, rgba(16,42,86,1) 0%, rgba(62,71,132,1) 100%)",
        flex: 1,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <img src={logo} style={{ maxWidth: 400, marginLeft: 20 }} alt="logo" />
        <p style={{ fontSize: 24, padding: 24, fontStyle: "italic" }}>
          Coming soon!
        </p>
      </div>
    </div>
  );
}

export default App;
