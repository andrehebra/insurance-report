<script>
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
    import { Label, Input, Button } from 'flowbite-svelte';
    import { Heading , Hr} from 'flowbite-svelte';
    import { Progressbar } from 'flowbite-svelte';
    import { sineOut } from 'svelte/easing';
    import { DarkMode } from 'flowbite-svelte';
    import { Select } from 'flowbite-svelte';
    import { Spinner } from 'flowbite-svelte';

    import { browser } from '$app/environment';

    export let data;

    let firstName = "";
    let lastName = "";

    $: firstName;
    $: lastName;

    let filled = false;

    
    
    

    let dataArray = [...data.dataArray];

    //console.log(dataArray);

    const currentDate = new Date();
    let instructorList = [];

    let aircraftList = [];
    let validCallsigns = [
        "N55294",
        "N55296",
        "N55297",
        "N345FH",
        "N62770",
        "N422CB",
        "N945MC",
        "N977TH",
    ]

    let periodArray = [];
    let selectedPeriod;
    let periodStartDate = new Date("March 1, 2024 00:00:00");
    let nextPeriod = new Date(periodStartDate.getTime());
    
    let tempNextDate = new Date("March 1, 2024 00:00:00");
    tempNextDate.setMonth(tempNextDate.getMonth() + 1, 0);
    //tempNextDate.setDate(tempNextDate.getDate() - 1);

    periodArray.push({
        date: periodStartDate,
        ISODate: periodStartDate.toISOString().slice(0, -5),
        value: periodStartDate.toISOString().slice(0, -5),
        name: periodStartDate.toLocaleDateString('en-US') + " - " + tempNextDate.toLocaleDateString('en-US'),
    });
    while (nextPeriod < currentDate) {
        nextPeriod.setMonth(nextPeriod.getMonth()+1);
        tempNextDate.setMonth(nextPeriod.getMonth()+1, 0);
        tempNextDate.setFullYear(nextPeriod.getFullYear());
        periodArray.push({
            date: nextPeriod,
            endDate: tempNextDate,
            ISOEndDate: tempNextDate.toISOString().slice(0,-5),
            ISODate: nextPeriod.toISOString().slice(0, -5),
            value: nextPeriod.toISOString().slice(0, -5),
            name: nextPeriod.toLocaleDateString('en-US') + " - " + tempNextDate.toLocaleDateString('en-US'),
        })
        //console.log(periodArray);
    }

    function compareFirst(a,b) {
        if ( a.firstName < b.firstName ){
            return -1;
        }
        if ( a.firstName > b.firstName ){
            return 1;
        }
        return 0;
    }

    function compareLast(a,b) {
        if ( a.lastName < b.lastName ){
            return -1;
        }
        if ( a.lastName > b.lastName ){
            return 1;
        }
        return 0;
    }

    function calculate() {
        filled = true;
        aircraftList.splice(0,aircraftList.length);

        let beginDate = new Date(selectedPeriod);
        let endDate = new Date(beginDate.getTime());
        endDate.setMonth(endDate.getMonth() + 1, 0);

        let beginPeriod = beginDate.toISOString().slice(0, -5);
        let endPeriod = endDate.toISOString().slice(0, -5);

        console.log(dataArray);

        for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i].aircraft != null) {
                if (dataArray[i].registration != null) {
                    if (dataArray[i].registration.flights[0] != null && dataArray[i].registration.flights[0].primaryLog.finishSeconds != null && dataArray[i].registration.flights[0].primaryLog.startSeconds != null) {
                        
                        //check to see if callsign is included in the aircraft list already
                        let caught = false;
                        for (let j = 0; j < aircraftList.length; j++) {
                            if (aircraftList[j].callsign == dataArray[i].aircraft.callSign) {
                                caught = true;
                                
                                //add into list at correct position if meet criteria
                                if (dataArray[i].registration.flights[0].primaryLog.startsAt > beginPeriod && dataArray[i].registration.flights[0].primaryLog.startSeconds < aircraftList[j].beginningSeconds) {
                                    aircraftList[j].beginningSeconds = dataArray[i].registration.flights[0].primaryLog.startSeconds;
                                }
                                if (dataArray[i].registration.flights[0].primaryLog.endsAt < endPeriod && dataArray[i].registration.flights[0].primaryLog.finishSeconds > aircraftList[j].endingSeconds) {
                                    aircraftList[j].endingSeconds = dataArray[i].registration.flights[0].primaryLog.finishSeconds;
                                }
                            }

                            
                        }

                        //create new element in the aircraftList if it is a valid entry
                        if (caught == false && validCallsigns.includes(dataArray[i].aircraft.callSign)) {

                            let begin = 10000000000000;
                            let end = 0;

                            console.log(beginPeriod + " " + dataArray[i].registration.flights[0].primaryLog.startsAt);
                            if (dataArray[i].registration.flights[0].primaryLog.startsAt > beginPeriod) {
                                begin = dataArray[i].registration.flights[0].primaryLog.startSeconds;
                            }
                            if (dataArray[i].registration.flights[0].primaryLog.endsAt < endPeriod) {
                                end = dataArray[i].registration.flights[0].primaryLog.finishSeconds;
                            }

                            aircraftList.push({
                                callsign: dataArray[i].aircraft.callSign,
                                beginningSeconds: begin,
                                endingSeconds: end,
                            });
                        }
                    }
                }
            }
            
        }

        console.log(aircraftList);

        aircraftList = aircraftList;
        
    }
    
</script>

<head>
    <title>Hours Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
</head>

<div class="container">

<Heading tag='h1'>Insurance Report Dashboard</Heading>

<Hr />

<Label>
    Select Time Period
    
    <Select class="mt-2" on:change={() => {calculate()}} items={periodArray} bind:value={selectedPeriod} />
</Label>

<!--
<div class="padding"></div>
<Button on:click={ calculate }>Submit</Button>
-->

{#if filled}
<Hr />



<Heading tag='h2'>Hobbs Hours Per Aircraft</Heading>
<div class="padding"></div>
<Table hoverable={true} shadow>
    <TableHead>
        <TableHeadCell>Aircraft</TableHeadCell>
        <!--  <TableHeadCell>Briefing</TableHeadCell>
        <TableHeadCell>Flight</TableHeadCell>
        <TableHeadCell>Debfiefing</TableHeadCell> -->
        <TableHeadCell>Hobbs Start</TableHeadCell>
        <TableHeadCell>Hobbs End</TableHeadCell>
        <TableHeadCell>Total Hobbs Time</TableHeadCell>
        
    </TableHead>
    <TableBody>
        {#each aircraftList as aircraft}
            <TableBodyRow>
                <TableBodyCell>{aircraft.callsign}</TableBodyCell>
                <!--  <TableBodyCell>{instructor.briefingSeconds / 60 / 60}</TableBodyCell>
                <TableBodyCell>{instructor.totalSeconds / 60 / 60}</TableBodyCell>
                <TableBodyCell>{instructor.debriefingSeconds / 60 / 60}</TableBodyCell> -->
                <TableBodyCell>{aircraft.beginningSeconds / 60 / 60}</TableBodyCell>
                <TableBodyCell>{aircraft.endingSeconds / 60 / 60}</TableBodyCell>
                <TableBodyCell>{Math.round(((aircraft.endingSeconds / 60 / 60)-(aircraft.beginningSeconds / 60 / 60))*10) / 10}</TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>
{/if}




</div>

<style>
   .container {
    padding: 20px;
    margin: auto;
   }
   .padding {
        height: 15px;
   }
</style>