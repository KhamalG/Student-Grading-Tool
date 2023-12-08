import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export function Login () {
    const styles = {
      loginBody: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "auto",
        backgroundColor: 'blue'
      },
      label: {
        fontFamily: 'Copperplate',
        color: 'white',
        textShadow: '2px 2px gray',
        paddingRight: '10px',
      },
      labelBackground: {
        display: 'flex-inline'
      },
      button: {
          padding: '10px',
          border: '2px solid gray',
          margin: '10px',
          fontFamily: 'Copperplate',
      },
      text: {
        fontFamily: 'Copperplate' ,
        paddingRight: '10px', 
      },
      header: {
        fontFamily: 'Copperplate',
        color: 'white',
        textShadow: '2px 2px gray'
      }
    }
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [navigate, setNavigate] = useState(false);

    const submit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()

        const result = await axios.post('http://localhost:3050/api/auth', {
            email: email,
            password: password,
        });
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', result.data.user._id);
        setNavigate(true);
    }

    if (navigate === true) {
        return <Navigate to="/classes"/>
    }

    return (
        <div style={styles.loginBody}>
          <main className="form-signin w-100 m-auto">
            <form onSubmit={submit}>
              <h1 style={styles.header}>Please sign in</h1>
              <div className="form-floating">
                    <label style={styles.label}>Email Address</label>
                    <input type="email"  id="floatingInput" placeholder="name@example.com"
                    onChange={e => setEmail(e.target.value)}
                    style={styles.text}
                    />
                </div> 
                <div className="form-floating">
                    <label style={styles.label}>Password</label>
                    <input type="password" id="floatingPassword" placeholder="Password"
                    onChange={e => setPassword(e.target.value)}
                    style={styles.text}
                    />
                </div>
              <button  type="submit" style={styles.button}><Link to='/classes'>Sign In</Link></button>
            </form>
          </main>
        </div>
    );
}