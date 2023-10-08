const express = require("express");

const usersService = require("../services/users");

/**
 * Update user's profile image
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {void}
 */
async function updateProfileImage(req, res, next) {
  try {
    const { userId } = req.user;
    const profileImagePath = req.file.path;
    const user = await usersService.getUserById(userId);
    user.update({
      image: profileImagePath.replace("src/", ""),
    });
    res.send(null);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  updateProfileImage,
};
