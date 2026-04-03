import React, { useState } from 'react';
// --- FIREBASE IMPORTS ---
import { db } from './firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function App() {
  // --- 1. STATE ---
  const [health, setHealth] = useState(100);
  const [points, setPoints] = useState(1000);
  const [logs, setLogs] = useState(["🛡️ System Online. Monitoring threats..."]);
  
  const [defenses, setDefenses] = useState({
    firewall: false,
    antivirus: false,
    encryption: false
  });

  // --- 2. FIREBASE LOGGING FUNCTION ---
  const logIncidentToFirebase = async (type, damage) => {
    try {
      await addDoc(collection(db, "attack_logs"), {
        attackType: type,
        damageTaken: damage,
        timestamp: serverTimestamp()
      });
      console.log("Logged to Cloud! ☁️");
    } catch (e) {
      console.error("Firebase Error: ", e);
    }
  };

  // --- 3. ATTACK LOGIC ---
  const simulateAttack = (type, damage) => {
    if (health <= 0) return;

    let finalDamage = damage;

    // Defense Checks
    if (type === 'DDoS Attack' && defenses.firewall) {
      finalDamage = Math.floor(damage * 0.2);
      setLogs(prev => [`🛡️ Firewall blocked 80% of DDoS!`, ...prev]);
    }
    
    if (type === 'Ransomware' && defenses.antivirus) {
      finalDamage = 0;
      setLogs(prev => [`✅ Antivirus neutralized the Ransomware!`, ...prev]);
    }

    if (type === 'Data Breach' && defenses.encryption) {
      finalDamage = 5; 
      setLogs(prev => [`🔐 Encryption protected the data!`, ...prev]);
    }

    const newHealth = Math.max(0, health - finalDamage);
    setHealth(newHealth);

    if (finalDamage > 0) {
      setLogs(prev => [`⚠️ ${type} hit! -${finalDamage}% health`, ...prev]);
    }
    
    // Cloud Sync
    logIncidentToFirebase(type, finalDamage);
  };

  // --- 4. DEFENSE TOGGLE ---
  const toggleDefense = (type, cost) => {
    if (defenses[type]) {
      setLogs(prev => [`ℹ️ ${type} is already active!`, ...prev]);
      return;
    }

    if (points >= cost) {
      setPoints(prev => prev - cost);
      setDefenses(prev => ({ ...prev, [type]: true }));
      setLogs(prev => [`🚀 Activated ${type.toUpperCase()} for ${cost} RP`, ...prev]);
    } else {
      setLogs(prev => [`❌ Not enough RP for ${type}!`, ...prev]);
    }
  };

  const resetSystem = () => {
    setHealth(100);
    setPoints(1000);
    setDefenses({ firewall: false, antivirus: false, encryption: false });
    setLogs(["🔄 System Rebooted. All clear."]);
  };

  // Logic for Security Level color and text
  const getSecurityLevel = () => {
    if (health > 60) return { text: 'STABLE', color: '#00ff00' };
    if (health > 30) return { text: 'WARNING', color: 'orange' };
    return { text: 'CRITICAL', color: 'red' };
  };

  const security = getSecurityLevel();

  // --- 5. UI ---
  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>🛡️ Cyberwar Banking Defense</h1>
      
      <div style={dashboardStyle}>
        {/* Stats Panel */}
        <div style={cardStyle}>
          <h2>🏦 BANK STATUS</h2>
          <h1 style={{ color: security.color, fontSize: '3.5rem', margin: '10px 0' }}>
            {health}%
          </h1>
          <h3 style={{ color: security.color, letterSpacing: '2px' }}>
            SECURITY: {security.text}
          </h3>
          <p>Resource Points: 💰 <strong>{points}</strong></p>
          {health === 0 && <button onClick={resetSystem} style={resetBtnStyle}>REBOOT SYSTEM</button>}
        </div>

        {/* Defense Panel */}
        <div style={{ ...cardStyle, borderColor: '#00aaff' }}>
          <h2>🛡️ DEFENSE TOOLS</h2>
          <button onClick={() => toggleDefense('firewall', 400)} style={{...btnStyle, backgroundColor: defenses.firewall ? '#004488' : '#333'}}>
            Firewall (400 RP) {defenses.firewall ? '✅' : '🔒'}
          </button>
          <button onClick={() => toggleDefense('antivirus', 500)} style={{...btnStyle, backgroundColor: defenses.antivirus ? '#004488' : '#333'}}>
            Antivirus (500 RP) {defenses.antivirus ? '✅' : '🔒'}
          </button>
          <button onClick={() => toggleDefense('encryption', 600)} style={{...btnStyle, backgroundColor: defenses.encryption ? '#004488' : '#333'}}>
            Encryption (600 RP) {defenses.encryption ? '✅' : '🔒'}
          </button>
        </div>

        {/* Attack Panel */}
        <div style={{ ...cardStyle, borderColor: '#ff4444' }}>
          <h2>🚀 SIMULATE ATTACKS</h2>
          <button onClick={() => simulateAttack('DDoS Attack', 20)} style={attackBtnStyle}>Launch DDoS</button>
          <button onClick={() => simulateAttack('Ransomware', 40)} style={attackBtnStyle}>Launch Ransomware</button>
          <button onClick={() => simulateAttack('Data Breach', 50)} style={attackBtnStyle}>Launch Data Breach</button>
        </div>
      </div>

      {/* Logs Section */}
      <div style={logContainerStyle}>
        <h3 style={{ color: '#00ff00', borderBottom: '1px solid #222', paddingBottom: '5px' }}>
          LIVE INCIDENT FEED (Cloud Connected)
        </h3>
        <div style={{ height: '120px', overflowY: 'auto' }}>
          {logs.map((log, index) => (
            <p key={index} style={{ color: '#00ff00', margin: '4px 0', fontSize: '0.9rem' }}>{`> ${log}`}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- CSS STYLES ---
const containerStyle = { backgroundColor: '#0a0a0a', color: 'white', minHeight: '100vh', padding: '30px', fontFamily: 'monospace' };
const headerStyle = { textAlign: 'center', color: '#00ff00', textShadow: '0 0 10px #00ff0055', marginBottom: '40px' };
const dashboardStyle = { display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' };
const cardStyle = { flex: '1', minWidth: '300px', border: '1px solid #333', padding: '25px', borderRadius: '15px', backgroundColor: '#121212', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' };
const btnStyle = { display: 'block', width: '100%', padding: '12px', margin: '10px 0', cursor: 'pointer', color: 'white', border: '1px solid #555', borderRadius: '6px', fontWeight: 'bold', transition: '0.3s' };
const attackBtnStyle = { ...btnStyle, backgroundColor: '#440000', borderColor: '#ff4444' };
const resetBtnStyle = { padding: '12px 25px', backgroundColor: '#00ff00', color: 'black', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '5px', marginTop: '15px' };
const logContainerStyle = { marginTop: '30px', backgroundColor: '#000', padding: '20px', borderRadius: '10px', border: '1px solid #00ff00', boxShadow: 'inset 0 0 10px #00ff0022' };

export default App;