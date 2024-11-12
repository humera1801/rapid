const Loader: React.FC = () => {
    return (
      <div
        className="loader"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.7)",
          zIndex: 1000,
          fontSize: "2rem",
          color: "#333",
        }}
      >
        <h1>Loading...</h1>
      </div>
    );
  };
   
  export default Loader;