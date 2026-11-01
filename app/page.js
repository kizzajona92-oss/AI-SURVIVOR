export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#07110d",
      color: "white",
      padding: "25px",
      fontFamily: "Arial"
    }}>
      <header>
        <h1 style={{color: "#22c55e"}}>
          AI SURVIVOR $
        </h1>
        <p>Intelligent Business Platform</p>
      </header>

      <hr style={{borderColor: "#263b30"}} />

      <h2>Welcome to AI SURVIVOR</h2>
      <p>
        Build opportunities. Manage businesses.
        Grow your future.
      </p>

      <section style={{
        background: "#10251a",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "25px"
      }}>
        <h3>My Capital</h3>
        <h2>UGX 0</h2>
        <p>Starting capital</p>
      </section>

      <h3 style={{marginTop: "30px"}}>
        Your Business Centre
      </h3>

      {[
        "AI Business Opportunities",
        "My Businesses",
        "AI Agents",
        "Transactions",
        "Approval Centre",
        "Activity History"
      ].map((item) => (
        <div key={item} style={{
          background: "#10251a",
          padding: "18px",
          borderRadius: "10px",
          marginTop: "12px"
        }}>
          {item}
        </div>
      ))}

      <footer style={{
        marginTop: "35px",
        color: "#22c55e",
        textAlign: "center"
      }}>
        AI SURVIVOR $ — Build From Zero
      </footer>
    </main>
  );
}
