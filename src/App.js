import logo from "./logo.svg";

function App() {
  return (
    <div
      style={{
        color: "#ffffff",
        margin: "auto",
        justifyContent: "center",
        textAlign: "center",
        height: "100%",
        backgroundColor: "#101828",
        flex: 1,
      }}
    >
      <img src={logo} style={{ maxWidth: 400 }} alt="logo" />
      <p style={{ fontSize: 24, padding: 24, fontStyle: "italic" }}>
        Coming soon!
      </p>
    </div>
  );
}

export default App;
