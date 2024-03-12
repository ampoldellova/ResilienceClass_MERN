const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const User = require('../models/user');
const LoginActivity = require('../models/loginActivity');

const { registerUser, loginUser, forgotPassword, logout, getUserProfile, updateProfile, getAllUsers, deleteUser, getUserDetails, updateUser, verifyCode } = require('../controllers/authController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.post('/register', upload.single("avatar"), registerUser);
router.post('/verification', isAuthenticatedUser, verifyCode);
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
                    registry: { $sum: 1 }
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
                    registry: 1,
                    _id: 0
                }
            }
        ]).sort({ date: 1 });

        const formattedData = userRegistrations.map(entry => ({
            date: new Date(entry.date).toLocaleDateString('en-PH', { month: '2-digit', day: '2-digit', year: '2-digit' }),
            registry: entry.registry
        }));

        res.json(formattedData);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/admin/user-activity', async (req, res) => {
    try {
        // Query the database to get user login activity data
        const activity = await LoginActivity.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    logins: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({ activity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;