
async function createToken(item) {
    console.log('TOKEN ITEM:', item)
    await localStorage.setItem('access_token', item)
}