import styled from "styled-components";
import { MomentT } from "./moment";
import { auth, db, storage } from "../utils/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  margin-top: 10px;
`;
const Column = styled.div`
  margin-top: 5px;
`;
const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;
const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
`;

const UpdateButton = styled.button`
  background-color: #5ea8c9;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
`;
export default function Momentbox({
  username,
  photo,
  text,
  userId,
  id,
}: MomentT) {
  const [editing, setEditing] = useState(false);
  const [newText, setNewText] = useState(text);
  const user = auth.currentUser;

  //delete핸들러
  const onDelete = async () => {
    const ok = confirm("정말 삭제하실건가요?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "moment", id));
      if (photo) {
        const photoRef = ref(
          storage,
          `moment/${user.uid}/${id}-${user.displayName}`
        );
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };
  //
  const onUpdateToggle = async () => {
    setEditing((prev) => !prev);
    setNewText(text);
  };
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewText(e.target.value);
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ref = doc(db, "moment", id);
    await updateDoc(ref, { text: newText });
    setEditing(false);
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {editing ? (
          <form onSubmit={onSubmit}>
            <textarea value={newText} onChange={onChange} />
            <button>저장</button>
            <button onClick={onUpdateToggle}>취소</button>
          </form>
        ) : (
          <Payload>{text}</Payload>
        )}

        {user?.uid === userId ? (
          <DeleteButton onClick={onDelete}>Delete</DeleteButton>
        ) : null}
        {user?.uid === userId ? (
          <UpdateButton onClick={onUpdateToggle}>수정하기</UpdateButton>
        ) : null}
      </Column>
      {photo ? (
        <Column>
          <Photo src={photo} />
        </Column>
      ) : null}
    </Wrapper>
  );
}
