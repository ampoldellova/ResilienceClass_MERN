const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const Class = require('../models/class');

const { newClass, userClasses, getSingleClass, joinClass, updateClass, getClassMembers, getClassrooms, deleteClassroom, newAdminClass, promoteStudent, softDeleteClassroom, userArchivedClasses, restoreClassroom, getSingleArchiveClass, removeUserFromClass, teacherDeleteClass, getAllDeletedClasses, adminRestoreClassroom } = require('../controllers/classController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.get('/class/user', isAuthenticatedUser, userClasses);
router.get('/class/:id', isAuthenticatedUser, getSingleClass);
router.get('/class/detail/archive/:id', isAuthenticatedUser, getSingleArchiveClass);
router.get('/class/user/archives', isAuthenticatedUser, userArchivedClasses);
router.get('/class/members/:id', isAuthenticatedUser, getClassMembers);
router.get('/admin/classrooms', isAuthenticatedUser, authorizeRoles('admin'), getClassrooms);
router.get('/admin/deleted/classrooms', isAuthenticatedUser, authorizeRoles('admin'), getAllDeletedClasses);
router.get('/admin/classrooms/attendance-analysis', async (req, res) => {
    try {
        const attendanceAnalysis = await Class.aggregate([
            {
                $unwind: '$joinedUsers'
            },
            {
                $group: {
                    _id: '$className',
                    totalStudents: { $sum: 1 },
                    attendedStudents: { $sum: { $cond: [{ $eq: ['$joinedUsers.role', 'student'] }, 1, 0] } }
                }
            },
            {
                $project: {
                    className: '$_id',
                    _id: 0,
                    attendanceRate: {
                        $divide: ['$attendedStudents', '$totalStudents']
                    }
                }
            },
            {
                $project: {
                    className: 1,
                    attendanceRate: { $round: ['$attendanceRate', 2] } // Round to two decimal places
                }
            }
        ]);

        res.json({ attendanceAnalysis });
    } catch (error) {
        console.error('Error fetching attendance analysis:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/class/join', isAuthenticatedUser, joinClass);
router.post('/class/new', isAuthenticatedUser, newClass);
router.post('/admin/classroom/new', isAuthenticatedUser, authorizeRoles('admin'), newAdminClass);

router.put('/class/update/:id', isAuthenticatedUser, upload.single("coverPhoto"), updateClass);
router.put('/class/member/promote', isAuthenticatedUser, promoteStudent);
router.put('/class/archive/:id/restore', isAuthenticatedUser, restoreClassroom);
router.put('/admin/class/deleted/:id/restore', isAuthenticatedUser, adminRestoreClassroom);

router.delete('/class/archive/:id', isAuthenticatedUser, softDeleteClassroom);
router.delete('/class/delete/:id', isAuthenticatedUser, teacherDeleteClass);
router.delete('/class/member/remove', isAuthenticatedUser, removeUserFromClass);
router.delete('/admin/classroom/delete/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteClassroom);





module.exports = router;