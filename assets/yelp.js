const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer DHlMvdIxJ3GkiJb-JvdUfVgar7Z2K_XQoqd5TP9z9x3_jDtZsH2-H6ss7DWllpBUE79UFsxLoNfebBjQFgPDjObq3upq-sC9Apvp3jZ87s-ASl2ns3_tPOsTjK1-ZHYx',
      cors: 'no-cors',
    }
  };
  
  fetch('https://api.yelp.com/v3/businesses/search?latitude=34.053691&longitude=-118.242767&categories=Bars&sort_by=rating&limit=5', options)
    .then(response => response.json())
    .then(response => console.log(response));
  