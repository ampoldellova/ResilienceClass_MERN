const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const User = require('../models/user');

const { registerUser, loginUser, forgotPassword, logout, getUserProfile, updateProfile, getAllUsers, deleteUser, getUserDetails, updateUser } = require('../controllers/authController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.post('/register', upload.single("avatar"), registerUser);
router.post('/login', loginUser);
router.get('/logout', logout);
router.post('/password/forgot', forgotPassword);
router.get('/me', isAuthenticatedUser, getUserProfile);
router.put('/me/update', isAuthenticatedUser, upload.single("avatar"), updateProfile);
router.get('/admin/users', isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router.delete('/admin/user/delete/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteUser);
router.get('/admin/user/:id', isAuthenticatedUser, authorizeRoles('admin'), getUserDetails);
router.put('/admin/user/:id', isAuthenticatedUser, authorizeRoles('admin'), upload.single("avatar"), updateUser);
router.get('/admin/userRegistrations', async (req, res) => {
    try {
        const userRegistrations = await User.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    date: {
                        $dateFromParts: {
                            year: '$_id.year',
                            month: '$_id.month',
                            day: '$_id.day'
                        }
                    },
                    count: 1,
                    _id: 0
                }
            }
        ]).sort({ date: 1 });

        const formattedData = userRegistrations.map(entry => ({
            date: new Date(entry.date).toLocaleDateString('en-PH', { month: '2-digit', day: '2-digit', year: '2-digit' }),
            count: entry.count
        }));

        res.json(formattedData);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;