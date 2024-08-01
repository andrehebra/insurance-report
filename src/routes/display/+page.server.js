/*
import { API_KEY } from '$env/static/private';

import gql from 'graphql-tag';
import { print } from 'graphql';

import { error } from '@sveltejs/kit';

const query = `query Query($all: Boolean, $after: String, $to: DateTime, $from: DateTime) {
  bookings(all: $all, after: $after, to: $to, from: $from) {
    nodes {
      ... on SingleStudentBooking {
        registration {
          flights {
            primaryLog {
              startSeconds
              finishSeconds
              startsAt
              endsAt
            }
            aircraft {
              callSign
            }
          }
        }
        aircraft {
          callSign
        }
      }
      ... on RentalBooking {
        registration {
          flights {
            primaryLog {
              startSeconds
              finishSeconds
              startsAt
              endsAt
            }
            aircraft {
              callSign
            }
          }
        }
        aircraft {
          callSign
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
  }`;

let currentDate = new Date();
let startDate = new Date(currentDate);
startDate.setDate(startDate.getDate() - 100);

//console.log(currentDate);
//const pastDate = new Date(); 
//pastDate = pastDate.setDate(pastDate.getDate() - 45);
//console.log(pastDate);

const currentISODate = currentDate.toISOString().slice(0, -5);
const startISODate = startDate.toISOString().slice(0, -5);

let i = 0;

export const load = async () => {
    console.log('Load function called in page.server.js');
    try {
        const variables = {
            to: currentISODate,
            all: true,
            from: startISODate,
        };

        const response = await fetch('https://api.flightlogger.net/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables
            })
        });

        let data = await response.json();
        let dataArray = [...data.data.bookings.nodes];
        //console.log(dataArray);

        while (data.data.bookings.pageInfo.hasNextPage == true) {
            const variables = {
                all: true,
                to: currentISODate,
                after: data.data.bookings.pageInfo.endCursor,
                from: startISODate,
            }

            const response = await fetch('https://api.flightlogger.net/graphql', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables
                })
            });

            //console.log(data.data.bookings.pageInfo.hasNextPage); 
            

            data = await response.json();
            console.log(i++); 
            console.log(data);

            await new Promise(resolve => setTimeout(resolve, 2000));

            try {

                for (let i = 0; i < data.data.bookings.nodes.length; i++) {
                    //console.log(data.data.bookings.nodes);
                    dataArray.push(data.data.bookings.nodes[i]);
                }
            } catch (e) {
                console.error("concatination error: " + e);

                return {"":""};
            }

        }

        //console.log (dataArray);

        return { dataArray };
    } catch (error) {
        console.error(`Error in load function :( ${error}`);
    } 
}
    
*/