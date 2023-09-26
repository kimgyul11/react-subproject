import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../utils/firebase";
import Momentbox from "./momentbox";
import { Unsubscribe } from "firebase/auth";

export interface MomentT {
  id: string;
  photo: string;
  text: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div``;

export default function Moment() {
  const [moment, setMoment] = useState<MomentT[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchMoment = async () => {
      const momentQuery = query(
        collection(db, "moment"),
        orderBy("createdAt", "desc"),
        limit(25)
      );

      unsubscribe = await onSnapshot(momentQuery, (snapshot) => {
        const moments = snapshot.docs.map((doc) => {
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
        setMoment(moments);
      });
    };
    fetchMoment();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {moment.map((moment) => (
        <Momentbox key={moment.id} {...moment} />
      ))}
    </Wrapper>
  );
}
