const logoutController = {};

logoutController.logout = async (req, res) => {
    try {
        res.clearCookie("authCookie");
        return res.status(200).json({ message: 'Logout successful' }); 

    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ message: 'Logout failed' });
    }
}

export default logoutController