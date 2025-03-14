import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import { logoutAPI } from "@/api/user.jsx"
import { getToken, removeToken } from "@/utils/index.jsx"
import { XMarkIcon } from '@heroicons/react/24/solid'

const shakeAnimation = {
    hover: {
        x: [0, -5, 5, -5, 5, 0],
        transition: {
            duration: 0.4,
        },
    },
}

function AccountCard({ account, onSelect, onDelete }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <motion.div
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 hover:shadow-lg transition-all relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover="hover"
            variants={shakeAnimation}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <AnimatePresence>
                {isHovered && (
                    <motion.button
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(account);
                        }}
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </motion.button>
                )}
            </AnimatePresence>
            <h2 className="text-xl font-semibold text-blue-700 mb-4">{account.name}</h2>
            <p className="text-2xl font-bold text-blue-900 mb-4">
                ${account.balance.toFixed(2)}
            </p>
            <button
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-sm hover:shadow"
                onClick={() => onSelect(account)}
            >
                Select
            </button>
        </motion.div>
    )
}

AccountCard.propTypes = {
    account: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        balance: PropTypes.number.isRequired,
    }).isRequired,
    onSelect: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
}

function Modal({ isOpen, onClose, onSubmit, children, title, submitText }) {
    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="bg-white rounded-lg p-8 w-96"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                >
                    <h2 className="text-2xl font-bold text-blue-600 mb-4">{title}</h2>
                    {children}
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSubmit}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            {submitText}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    submitText: PropTypes.string.isRequired,
}

export default function Account() {
    const [accounts, setAccounts] = useState([
        { id: '1', name: 'Personal Checking', balance: 5234.56 },
        { id: '2', name: 'Vacation Fund', balance: 10567.89 },
        { id: '3', name: 'Emergency Fund', balance: 2345.67 },
    ])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [newAccountName, setNewAccountName] = useState('')
    const [username, setUsername] = useState('')
    const [accountToDelete, setAccountToDelete] = useState(null)

    useEffect(() => {
        // Fetch the username from localStorage or your authentication state
        const storedUsername = localStorage.getItem('username')
        if (storedUsername) {
            setUsername(storedUsername)
        }
    }, [])

    const addNewAccount = () => {
        setIsModalOpen(true)
    }

    const handleCreateAccount = () => {
        if (newAccountName.trim()) {
            const newAccount = {
                id: (accounts.length + 1).toString(),
                name: newAccountName,
                balance: 0,
            }
            setAccounts([...accounts, newAccount])
            setNewAccountName('')
            setIsModalOpen(false)
        }
    }

    const handleSelectAccount = (account) => {
        console.log('Selected account:', account)
        window.location.href = '/'
    }

    const handleDeleteAccount = (account) => {
        setAccountToDelete(account)
        setIsDeleteModalOpen(true)
    }

    const confirmDeleteAccount = () => {
        if (accountToDelete) {
            setAccounts(accounts.filter(account => account.id !== accountToDelete.id))
            setIsDeleteModalOpen(false)
            setAccountToDelete(null)
        }
    }

    const handleLogout = async () => {
        try {
            await logoutAPI()
            // Clear any stored authentication data
            localStorage.removeItem('username')
            const token = getToken()
            removeToken(token)
            // Redirect to login page
            window.location.href = '/login'
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600">Select an Account</h1>
                    <button
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        onClick={() => setIsLogoutModalOpen(true)}
                    >
                        Log Out
                    </button>
                </div>
                <p className="text-xl text-blue-800 mb-8">Welcome back, {username}</p>
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {accounts.map((account) => (
                        <AccountCard
                            key={account.id}
                            account={account}
                            onSelect={handleSelectAccount}
                            onDelete={handleDeleteAccount}
                        />
                    ))}
                </motion.div>
                <motion.button
                    className="mt-8 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-lg font-semibold shadow-sm hover:shadow"
                    onClick={addNewAccount}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    + Add New Account
                </motion.button>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateAccount}
                title="Create New Account"
                submitText="Create"
            >
                <input
                    type="text"
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                    placeholder="Enter account name"
                    className="w-full p-2 border border-blue-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </Modal>

            <Modal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onSubmit={handleLogout}
                title="Confirm Logout"
                submitText="Logout"
            >
                <p className="text-lg text-gray-700">Are you sure you want to log out?</p>
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onSubmit={confirmDeleteAccount}
                title="Confirm Delete Account"
                submitText="Delete"
            >
                <p className="text-lg text-gray-700">
                    Are you sure you want to delete the account "{accountToDelete?.name}"?
                    This action cannot be undone.
                </p>
            </Modal>
        </div>
    )
}