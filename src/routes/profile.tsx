import styled from "styled-components";
import { auth, db, storage } from "../utils/firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";

import {
  collection,
  limit,
  orderBy,
  where,
  query,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { MomentT } from "../components/moment";
import Momentbox from "../components/momentbox";
import { Form } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;
const EditName = styled.input`
  font-size: 22px;
  color: white;
  background-color: transparent;
`;
const Moment = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;
const Button = styled.button``;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [moment, setMoment] = useState<MomentT[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [newNickname, setNewNickname] = useState(
    user?.displayName ? user.displayName : "무명의 회원"
  );
  const toggle = () => {
    setIsEdit((prev) => !prev);
  };
  //이미지 변경
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    await updateProfile(user, {
      displayName: newNickname,
    });
    setIsEdit(false);
    Promise.all(
      moment.map(async (mo) => {
        const ref = doc(db, "moment", mo.id);
        await updateDoc(ref, { username: newNickname });
        return mo; // 현재 요소를 그대로 반환
      })
    )
      .then((updatedMoments) => {
        setMoment(updatedMoments);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewNickname(e.target.value);
  };
  //데이터 가져오기
  const fetchMoment = async () => {
    const momentQuery = query(
      collection(db, "moment"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(momentQuery);
    const moment = snapshot.docs.map((doc) => {
      const { text, createdAt, userId, username, photo } = doc.data();
      return {
        text,
        createdAt,
        userId,
        username,
        photo,
        id: doc.id,
      };
    });
    setMoment(moment);
  };
  useEffect(() => {
    fetchMoment();
  }, []);
  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      {isEdit ? (
        <Form onSubmit={onSubmit}>
          <EditName value={newNickname} onChange={onChange} />
          <Button>저장하기</Button>
        </Form>
      ) : (
        <Name>{user?.displayName ?? "Anonymous"}</Name>
      )}
      <Button onClick={toggle}>{isEdit ? "취소" : "수정"}</Button>
      <Moment>
        {moment.map((moment) => (
          <Momentbox key={moment.id} {...moment} />
        ))}
      </Moment>
    </Wrapper>
  );
}
