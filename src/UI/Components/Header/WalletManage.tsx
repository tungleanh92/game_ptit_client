import React, { useCallback, useState, useContext } from 'react';
import { TransactionContext } from '../../../context/TransactionContext';
import Modal from '../Modal';
import style from './index.module.scss';

export default function LoadModal() {
    const [showModal, setModal] = useState(false);
    const { handleChangeDeposit, handleChangeWithdraw,
        depositData, withdrawData, connectWallet,
        // eslint-disable-next-line
        depositToken, withdrawToken, wallet } = useContext<any>(TransactionContext);
    
    const onToggle = useCallback(() => {
        if (!wallet.address) {
            return
        }
        setModal(m => !m)
    }, []);
    console.log(wallet);

    interface InputType {
        // eslint-disable-next-line
        placeholder: any;
        // eslint-disable-next-line
        name: any;
        // eslint-disable-next-line
        type: any;
        // eslint-disable-next-line
        value: any;
        // eslint-disable-next-line
        handleChange: any
    }

    const Input = ({ placeholder, name, type, value, handleChange }: InputType) => (
        <input
            placeholder={placeholder}
            type={type}
            step="0.0001"
            value={value}
            onChange={(e) => handleChange(e, name)}
            style={{display: 'block', margin: '10px 0', fontSize: '16px'}}
            className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
        />
    );

    return (
        <div className={style.headerItem} onClick={onToggle}>
            {wallet.address ? (
                <p>Wallet</p>
            ) : (
                <button onClick={connectWallet}>Connect wallet</button>
            )}
            <Modal visible={showModal} onExit={onToggle}>
                <h2>Address: {wallet.address}</h2>
                <h2>Balance: {wallet.balances}</h2>

                <Input placeholder="Amount (ETH) to deposit" name="amount" value={depositData} type="text" handleChange={handleChangeDeposit} />
                <button className="menu-btn mt-2" onClick={depositToken}>Deposit token</button>
                <Input placeholder="Amount (ETH) to withdraw" name="amount" value={withdrawData} type="text" handleChange={handleChangeWithdraw} />
                <button className="menu-btn mt-2" onClick={withdrawToken}>Withdraw token</button>
            </Modal>
        </div>
    );
}
