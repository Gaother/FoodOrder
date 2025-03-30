const webpush = require('web-push');
const dotenv = require('dotenv');
dotenv.config();

const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails('https://my-site.com/contact', publicVapidKey, privateVapidKey);

const pushNotificationService = {

    async sendPushNotification (subscriptions, content) {
        try {
            console.log('Preparing payload...');
            const payload = JSON.stringify({
                title: content.title,
                body: content.body,
            });
            console.log('Payload prepared:', payload);

            subscriptions.forEach(subscription => {
                console.log('Sending notification to subscription:', subscription);
                webpush.sendNotification(subscription, payload).catch(error => {
                    console.error('Error sending notification:', error.stack);
                });
            });
            console.log('Notifications sent.');
        } catch (error) {
            console.error(error.stack);
        }
    }
};

module.exports = pushNotificationService;