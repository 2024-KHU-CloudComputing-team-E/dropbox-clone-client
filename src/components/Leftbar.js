import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.min.css";

function Leftbar() {
  return (
    <Dropdown.Menu show>
      <Dropdown.Item eventKey="1">InstaBox</Dropdown.Item>
      <Dropdown.Item eventKey="1">메뉴 1</Dropdown.Item>
      <Dropdown.Item eventKey="2">메뉴 2</Dropdown.Item>
      <Dropdown.Item eventKey="3">메뉴 3</Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item eventKey="4">구분선 아래 메뉴 1</Dropdown.Item>
    </Dropdown.Menu>
  );
}

export default Leftbar;
