const public_key = '506ed6f89fef4fafdfc895eec59c7f35'
const private_key = 'f4cb12401e8ec6a2d8270f11cbe3a83dcac6591c';

async function fetchMarvel() {
  try {
    const response = await fetch(`https://gateway.marvel.com/v1/public/comics?apikey=${public_key}`)
    const data = await response.json()
    console.log(data.data.results);

  } catch (error) {

    console.log('erro:', error)
  }
}

fetchMarvel();