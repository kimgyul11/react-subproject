import styled from "styled-components";

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
`;
export const Title = styled.h1`
  font-size: 42px;
`;
export const Form = styled.form`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: 3px solid white;
  width: 100%;
  font-size: 16px;
  &:focus {
    outline: none;
    border: 3px solid #79d2c9;
  }

  &[type="submit"] {
    cursor: pointer;
    &:hover {
      transition: 0.5s;
      opacity: 0.8;
    }
  }
`;
export const Error = styled.span`
  font-weight: 600;
  color: red;
`;
export const Switcher = styled.span`
  margin-top: 20px;
  a {
    color: #e0e0e0;
    text-decoration: none;
  }
`;
