// components/LoadingSpinner.tsx
const LoadingSpinner = () => {
    return (
        <div className="loading-container">
            <img
                src="/img/parceltruck.gif"
                alt="loading-gif"
                className="loading-gif"
            />
            {/* <div className="loading-spinner"></div> */}

            <style jsx>{`
          .loading-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }
  
         .loading-gif {
           position: absolute;
             width: 150px;
              height: 15    0px;
            border-radius: 50%; 
             z-index: -1;
               overflow: hidden; 
}

  
          .loading-spinner {
            position: absolute;
            width: 50px;
            height: 50px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            animation: spin 2s linear infinite;
            z-index: 1; /* Ensures the spinner is above the gif */
          }
  
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        </div>
    );
};

export default LoadingSpinner;
