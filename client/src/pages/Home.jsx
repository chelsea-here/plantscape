import { Link } from "react-router-dom";
import './Home.css';

export default function Home() {
  return (
    <>
    <div className="home-container"></div>
      <div className="hero">
        <h1>Turn your backyard into your dream garden.</h1>
      </div>
      <div>
        <ol>
          <li>
            What's your design style? <br />
            <Link to="/quiz">Take our Quiz</Link>
          </li>

          <li>
            Just need to <Link to="/plants">find plants</Link> for your garden?
            <p>
              We'll help you locate plants that match your style & your sun
              conditions.
            </p>
          </li>
          <li>
            Ready to <Link to="/newproject">start a project?</Link>
            <p>We'll walk you through a beautiful design one bed at a time.</p>
          </li>
        </ol>
      </div>
    </>
  );
}
