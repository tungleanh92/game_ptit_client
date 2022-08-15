import React, { useContext } from 'react';
import { TransactionContext } from "./context/TransactionContext";
import styled from "styled-components";

const RoomIdInput = styled.input`
  height: 30px;
  width: 20em;
  font-size: 17px;
  outline: none;
  border: 1px solid #3f51b5;
  border-radius: 3px;
  padding: 0 10px;
  margin-bottom: 10px;
  display: block;
  margin: 20px auto;
`;

const CreateButton = styled.button`
  outline: none;
  background-color: #3f51b5;
  color: #fff;
  font-size: 17px;
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 4px 18px;
  transition: all 230ms ease-in-out;
  margin-top: 0.5em;
  margin-bottom: 20px;
  cursor: pointer;
  display: block;
  margin: auto;

  &:hover {
    background-color: transparent;
    border: 2px solid #3f51b5;
    color: #3f51b5;
  }
`;

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const Menu = () => {
  const { handleChangeFaucetClaim, faucetClaimData, faucetClaim } = useContext<any>(TransactionContext);

  const Input = ({ placeholder, name, type, value, handleChange }: any) => (
    <input
      placeholder={placeholder}
      type={type}
      step="0.0001"
      value={value}
      onChange={(e) => handleChange(e, name)}
      className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
    />
  );

  return (
    <MainContainer>
      <h2 style={{textAlign: 'center', color: '#3f51b5', marginTop: '50px'}}>Faucet claim</h2>
      <RoomIdInput
        placeholder="Address to claim"
        value={faucetClaimData}
        onChange={handleChangeFaucetClaim}
        type="text"
      />
      <CreateButton className="menu-btn mt-2" onClick={faucetClaim}>Faucet claim</CreateButton>
    </MainContainer>
    // <div className="d-flex justify-content-center">
    //   <div className="menu">
    //     <div className="text-center game-name">
    //       <h2>Faucet claim</h2>
    //     </div>
    //     <div>
    //         <div className="text-center d-flex flex-column menu-btns">
    //           <Input placeholder="Address to claim" name="addressTo" value={faucetClaimData} type="text" handleChange={handleChangeFaucetClaim} />
    //           <button className="menu-btn mt-2" onClick={faucetClaim}>Faucet claim</button>
    //         </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Menu;