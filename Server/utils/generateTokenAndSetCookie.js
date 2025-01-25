import jwt from "jsonwebtoken";
export const generateTokenAndSetCookie = (res, id) => {
   const token = jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "7d" //7 days
    });

    res.cookie("jwt", token, {
        httpOnly: true, //client cannot be accessed by  client side js
        secure: process.env.NODE_ENV === "development", //cookie works on https
        // expires: new Date(Date.now() + 2*60*1000),
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 //7 days,
    });
};