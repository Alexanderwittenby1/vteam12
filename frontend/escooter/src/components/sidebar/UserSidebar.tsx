import { BsSpeedometer2, BsCreditCard, BsClockHistory } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";


const UserSidebar = () => {

  return (
    <ul className="nav flex-column">
      <li className="nav-item align-items-center">
        <Link
          className="nav-link d-flex text-accent-2 align-items-center"
          href="/profile"
        >
          <BsSpeedometer2 className="bi me-2" style={{ color: "#6d3170" }} />
          Dashboard
        </Link>
      </li>
      <li className="nav-item">
        <a
          className="nav-link d-flex text-accent-2 align-items-center"
          href="/UserHistory"
        >
          <BsClockHistory className="bi me-2" style={{ color: "#6d3170" }} />
          History
        </a>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link d-flex text-accent-2 align-items-center"
          href="/payment"
        >
          <BsCreditCard className="bi me-2" style={{ color: "#6d3170" }} />
          Payment
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link d-flex text-accent-2 align-items-center"
          href="/AccountSettings"
        >
          <CgProfile className="bi me-2" style={{ color: "#6d3170" }} />
          Account settings
        </Link>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link d-flex text-accent-2 align-items-center"
          href="/webSocket"
        >
          <CgProfile className="bi me-2" style={{ color: "#6d3170" }} />
          WebSocket
        </Link>
      </li>
      
    </ul>
  );
};

export default UserSidebar;