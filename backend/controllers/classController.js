const Class = require('../models/class');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary');
const generateString = require('../utils/codeGenerator')
const user = require('../models/user');
const ArchivedClassrooms = require('../models/archivedClassrooms')
const DeletedClasses = require('../models/deletedClasses')

exports.newClass = async (req, res, next) => {
    // console.log(req.user)
    const randomCode = generateString(6);
    req.body.classCode = randomCode.trim();
    req.body.joinedUsers = {
        user: []
    };
    req.body.joinedUsers.user.push(req.user._id);
    req.body.joinedUsers.role = 'teacher';

    const classRoom = await Class.create(req.body);
    if (!classRoom)
        return res.status(400).json({
            success: false,
            message: 'Classroom has not been created'
        })

    res.status(201).json({
        success: true,
        classRoom
    })
}

exports.getClassrooms = async (req, res, next) => {

    const classrooms = await Class.find().populate({
        path: 'joinedUsers.user',
        model: user
    });

    res.status(200).json({
        success: true,
        classrooms: classrooms
    })
}

exports.updateClass = async (req, res, next) => {
    let classRoom = await Class.findById(req.params.id)
    const newClassData = {
        className: req.body.className,
        section: req.body.section,
        subject: req.body.subject,
        roomNumber: req.body.roomNumber,
    }

    // console.log(req.body)
    if (!classRoom) {
        return res.status(404).json({
            success: false,
            message: 'Class not found'
        })
    }

    if (req.file) {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: 'ResilienceClass/classCoverPhotos',
            crop: "scale"
        })

        newClassData.coverPhoto = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }

    classRoom = await Class.findByIdAndUpdate(req.params.id, newClassData, {
        new: true,
        runValidators: true,
        useFindandModify: false
    })

    return res.status(200).json({
        success: true,
        classRoom
    })
}

exports.userClasses = async (req, res, next) => {

    const classRoom = await Class.find();
    const classes = classRoom.filter(classOne => {
        for (let index = 0; index < classOne.joinedUsers.length; index++) {
            if (classOne.joinedUsers[index].user.toString() == req.user._id.toString()) {
                return classOne
            }
        }
    })
    res.json({
        classRoom: classes
    })
}

exports.softDeleteClassroom = async (req, res, next) => {
    try {
        const classroom = await Class.findById(req.params.id);
        if (!classroom) {
            return res.status(404).json({
                success: false,
                message: 'Classroom not found'
            });
        }

        const archivedClassroom = await ArchivedClassrooms.create(classroom.toObject());

        await Class.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Classroom soft deleted and moved to Archived Classrooms',
            archivedClassroom
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.userArchivedClasses = async (req, res, next) => {
    try {
        const archivedClassroom = await ArchivedClassrooms.find();

        const archivedClasses = archivedClassroom.filter(classOne => {
            for (let index = 0; index < classOne.joinedUsers.length; index++) {
                if (classOne.joinedUsers[index].user.toString() == req.user._id.toString()) {
                    return classOne
                }
            }
        })

        res.json({
            archivedClassroom: archivedClasses
        })
    } catch (error) {
        console.log(error)
    }
}

exports.restoreClassroom = async (req, res, next) => {
    try {
        const archivedClassroom = await ArchivedClassrooms.findById(req.params.id);
        if (!archivedClassroom) {
            return res.status(404).json({
                success: false,
                message: 'Archived Classroom not found'
            });
        }

        const classroom = await Class.create(archivedClassroom.toObject());

        await ArchivedClassrooms.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Classroom restored from Archived',
            classroom
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getSingleClass = async (req, res, next) => {
    const classRoom = await Class.findById(req.params.id)

    if (!classRoom) {
        return res.status(404).json({
            success: false,
            message: 'Classroom not found'
        })
    }
    res.status(200).json({
        success: true,
        classRoom: classRoom
    })
}

exports.getSingleArchiveClass = async (req, res, next) => {
    const archiveClass = await ArchivedClassrooms.findById(req.params.id)

    if (!archiveClass) {
        return res.status(404).json({
            success: false,
            message: 'Archived Classroom not found'
        })
    }
    res.status(200).json({
        success: true,
        archiveClass: archiveClass
    })
}

exports.getClassMembers = async (req, res, next) => {
    const classRoom = await Class.findById(req.params.id).populate({
        path: 'joinedUsers.user',
        model: user
    })

    if (!classRoom) {
        return res.status(404).json({
            success: false,
            message: 'Class Members not found'
        })
    }

    res.status(200).json({
        success: true,
        classMembers: classRoom.joinedUsers
    })
}

exports.joinClass = async (req, res, next) => {
    const { enteredCode } = req.body;

    try {
        const foundClass = await Class.findOne({ classCode: enteredCode });
        if (!foundClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        const isUserJoined = foundClass.joinedUsers.some(user => user.user.toString() === req.user._id);
        if (isUserJoined) {
            return res.status(400).json({ message: "User already joined the class." });
        }

        foundClass.joinedUsers.push({ user: req.user._id, role: 'student' });

        await foundClass.save();

        res.status(200).json({ message: "User joined the class successfully." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error." });
    }
}

exports.deleteClassroom = async (req, res, next) => {
    const classroom = await Class.findByIdAndDelete(req.params.id);
    if (!classroom) {
        return res.status(404).json({
            success: false,
            message: 'Classroom not found'
        })
    }

    res.status(200).json({
        success: true,
        message: 'Classroom deleted'
    })
}

exports.newAdminClass = async (req, res, next) => {
    const randomCode = generateString(6);
    req.body.classCode = randomCode.trim();

    const classRoom = await Class.create(req.body);
    if (!classRoom)
        return res.status(400).json({
            success: false,
            message: 'Classroom has not been created'
        })

    res.status(201).json({
        success: true,
        message: 'Classroom has been created!',
        classRoom
    })
};

exports.promoteStudent = async (req, res, next) => {
    const classroom = await Class.findById(req.query.classId)
    classroom.joinedUsers.find(user => user.user.toString() === req.query.userId).role = 'teacher'
    classroom.save()

    return res.status(200).json({
        success: true,
    })
};

exports.removeUserFromClass = async (req, res, next) => {
    try {
        const classRoom = await Class.findById(req.query.classId);

        if (!classRoom) {
            return res.status(404).json({ success: false, message: 'Classroom not found' });
        }

        const userIndex = classRoom.joinedUsers.findIndex(item => item.user.toString() === req.query.userId);

        if (userIndex === -1) {
            return res.status(404).json({ success: false, message: 'User not found in the class' });
        }

        classRoom.joinedUsers.splice(userIndex, 1);
        classRoom.save();

        return res.status(200).json({ success: true, message: 'User removed from the class successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.teacherDeleteClass = async (req, res, next) => {
    try {
        const archivedClassroom = await ArchivedClassrooms.findById(req.params.id);
        if (!archivedClassroom) {
            return res.status(404).json({
                success: false,
                message: 'Archived Classroom not found'
            });
        }

        const deletedClassroom = await DeletedClasses.create(archivedClassroom.toObject());

        await ArchivedClassrooms.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Classroom Permanently Deleted!',
            deletedClassroom
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllDeletedClasses = async (req, res, next) => {
    const deletedClasses = await DeletedClasses.find().populate({
        path: 'joinedUsers.user',
        model: user
    });

    res.status(200).json({
        success: true,
        deletedClasses
    })
};