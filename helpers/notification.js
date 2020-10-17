const axios = require('axios')
async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Check Now!',
      body: `Dear user, kamu terdeteksi berada di satu tempat yang sama dengan orang yang 
      teridentifaksi positif Covid-19. JANGAN PANIK! Isolasi mandiri dan segera cek status kamu ke rumah sakit terdekat.`,
      data: { data: 'goes here' },
    };
  
    await axios
    .post('https://exp.host/--/api/v2/push/send', message,
    {
      headers: {
          'Accept': 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',}
    })
    .then( function(res) {
        console.log(`RESP: ${res.data}`)
      })
      .catch( function(error){
        console.log(`ERR: ${error}`)
      })
  }

// sendPushNotification('ExponentPushToken[noIv86Iv0kqMRacllB1h0q]') -> test to invoke notif
  module.exports = sendPushNotification
