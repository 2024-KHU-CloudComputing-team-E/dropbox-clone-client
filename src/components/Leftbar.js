import Dropdown from "react-bootstrap/Dropdown";
import ListGroup from "react-bootstrap/ListGroup";
import ProgressBar from "react-bootstrap/ProgressBar";
import "bootstrap/dist/css/bootstrap.min.css";

function Leftbar() {
  return (
    <Dropdown.Menu show>
      <Dropdown.Item eventKey="1">
        <br></br>
        <h2>InstaBox</h2>
        <br></br>
      </Dropdown.Item>
      <br></br>
      <ListGroup>
        <ListGroup.Item action href="#link1">
          <h5>업로드</h5>
        </ListGroup.Item>
        <ListGroup.Item action href="#link2">
          <h5>저장소</h5>
        </ListGroup.Item>

        <ListGroup.Item action href="#link3">
          <h5>즐겨찾기</h5>
        </ListGroup.Item>

        <ListGroup.Item action href="#link4">
          <h5>휴지통</h5>
        </ListGroup.Item>
      </ListGroup>
      <br></br>
      <br></br>
      <br></br>
      <Dropdown.Item eventKey="1">
        <h5>저장용량</h5>
        100GB 중 18GB 사용
        <ProgressBar now={60} />
      </Dropdown.Item>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
    </Dropdown.Menu>
  );
}

export default Leftbar;
