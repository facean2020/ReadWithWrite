import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to ReadWithWrite</h1>
        <p>Your ultimate platform for reading and writing.</p>
      </header>
      <main className="home-content">
        <section className="features">
          <h2>Features</h2>
          <ul>
            <li>RSS Feed Aggregation</li>
            <li>AI-Powered Writing Prompts</li>
            <li>Collaborative Writing Sessions</li>
          </ul>
        </section>
      </main>
      <footer className="home-footer">
        <p>&copy; 2026 ReadWithWrite. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
