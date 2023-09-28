import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../utils/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  &::placeholder {
    font-size: 16px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }
  &:focus {
    outline: none;
    border-color: #5ea8c9;
  }
`;
const AttachFileBtn = styled.label`
  padding: 10px 0px;
  color: #5ea8c9;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #5ea8c9;
  cursor: pointer;
`;
const AttachFileInput = styled.input`
  display: none;
`;
const SubmitBtn = styled.input`
  background-color: #5ea8c9;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
`;

export default function PostForm() {
  const [isLoading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const user = auth.currentUser;
  //change
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  //file upload
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };
  //submit
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || isLoading || text.trim() === "" || text.length > 180) return;

    try {
      setLoading(true);
      const imgMaxSize = 1024 * 1024;
      const docs = await addDoc(collection(db, "moment"), {
        text,
        createdAt: Date.now(),
        username: user.displayName || "소셜계정",
        userId: user.uid,
      });
      //이미지 크기가 초과할경우 -> docs를 삭제하고 알림을 보낸다.
      if (file && file.size > imgMaxSize) {
        alert("파일 크기가 1MB를 초과합니다.");
        await deleteDoc(doc(db, "moment", docs.id));
        setText("");
        setFile(null);
        return;
      }
      //이미지가 알맞는 경우 업데이트를 한다.
      if (file && file.size < imgMaxSize) {
        const locationRef = ref(
          storage,
          `moment/${user.uid}/${docs.id}-${user.displayName}`
        );
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(docs, {
          photo: url,
        });
      }
      setText("");
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        rows={5}
        maxLength={180}
        placeholder="글을 작성해보세요"
        value={text}
        onChange={onChange}
        required
      />
      <AttachFileBtn htmlFor="file">
        {file ? "이미지 추가완료✅" : "사진 업로드"}
      </AttachFileBtn>
      <AttachFileInput
        id="file"
        accept="image/*"
        type="file"
        onChange={onFileChange}
      />
      <SubmitBtn type="submit" value={isLoading ? "글 올리는중..." : "확인"} />
    </Form>
  );
}
