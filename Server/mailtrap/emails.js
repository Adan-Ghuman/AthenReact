import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
import { mailtrapClient, sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Account Verification",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
            category: "Verification Email"
        })
        console.log("Verification Email sent successfully", response);
        
    } catch (error) {
        console.error("Error sending verification email", error);
throw new Error(`Error sending verification email: ${error}`);
    }
}

export const sendWelcomeEmail = async (email,name) => {
    const recipient = [{email}]
    try {
        const response = await mailtrapClient.send({
            to: recipient,
            from: sender,
            template_uuid: "46d43689-7b88-4047-b313-892378994283",
            template_variables: {
            "DreamSpace": "AR-Enhanced Interior Designs",
            "name": "Adan Ghuman"
    },
        })
        console.log("Welcome Email sent successfully", response);
        
    } catch (error) {
    console.error("Error sending welcome email", error);

    throw new Error(`Error sending welcome email: ${error}`);

    }
};

export const sendResetPasswordEmail = async (email, resetURL) => {
const recipient = [{email}];
try {
    const response = await mailtrapClient.send({
        from: sender,
        to: recipient,
        subject: "Password Reset",
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
        category: "Password Reset"
    });

} catch (error) {
    console.error("Error sending password reset email", error);

    throw new Error(`Error sending password reset email: ${error}`);
}

}

export const sendPasswordResetSuccessEmail = async (email) => {
    const recipient = [{email}];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset"
        });

        
        console.log("Password Reset Success Email sent successfully", response);
        
    } catch (error) {
        console.error("Error sending password reset success email", error);
        throw new Error(`Error sending password reset success email: ${error}`);
    }
}