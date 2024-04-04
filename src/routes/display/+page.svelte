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

    let periodArray = [];
    let selectedPeriod;
    let periodStartDate = new Date("February 18, 2024 00:00:00");
    let nextPeriod = new Date(periodStartDate.getTime());
    
    let tempNextDate = new Date(periodStartDate.getTime() + (13*24*60*60*1000));

    periodArray.push({
        date: periodStartDate,
        ISODate: periodStartDate.toISOString().slice(0, -5),
        value: periodStartDate.toISOString().slice(0, -5),
        name: periodStartDate.toLocaleDateString('en-US') + " - " + tempNextDate.toLocaleDateString('en-US'),
    });
    while (nextPeriod < currentDate) {
        nextPeriod = new Date(nextPeriod.getTime() + (14*24*60*60*1000));
        tempNextDate = new Date(nextPeriod.getTime() + (13*24*60*60*1000));
        periodArray.push({
            date: nextPeriod,
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

        instructorList.splice(0,instructorList.length);

        let currentSelectedPeriod = new Date(selectedPeriod);
        let endOfPeriod = new Date(currentSelectedPeriod.getTime() + (14*24*60*60*1000));
        

        for (let i = 0; i < dataArray.length; i++) {
            //console.log(dataArray[i]);
            let caught = 0;
            if (dataArray[i] != null && dataArray[i].instructor != null && dataArray[i].registration != null && dataArray[i].startsAt != null) {
                if (dataArray[i].instructor.firstName != "Dispatch" && dataArray[i].startsAt >= currentSelectedPeriod.toISOString().slice(0, -5) && dataArray[i].startsAt < endOfPeriod.toISOString().slice(0, -5)) {
                    for (let j = 0; j < instructorList.length; j++) {
                        if (dataArray[i].instructor.firstName == instructorList[j].firstName && dataArray[i].instructor.lastName == instructorList[j].lastName) {
                            caught = 1;
                        }
                    }

                    if (caught == 0) {
                        instructorList.push({
                            firstName: dataArray[i].instructor.firstName,
                            lastName: dataArray[i].instructor.lastName,
                            briefingSeconds: dataArray[i].registration.briefingSeconds,
                            totalSeconds: dataArray[i].registration.totalSeconds,
                            debriefingSeconds: dataArray[i].registration.debriefingSeconds,
                            reservationList: [dataArray[i]]
                        })
                    } else if (caught == 1) {
                        for (let j = 0; j < instructorList.length; j++) {
                            if (dataArray[i].instructor.firstName == instructorList[j].firstName && dataArray[i].instructor.lastName == instructorList[j].lastName) {
                                instructorList[j].briefingSeconds += dataArray[i].registration.briefingSeconds;
                                instructorList[j].totalSeconds += dataArray[i].registration.totalSeconds;
                                instructorList[j].debriefingSeconds += dataArray[i].registration.debriefingSeconds;
                                instructorList[j].reservationList.push(dataArray[i]);
                            }
                        }
                    } else {
                        console.log("This was not caught for some reason" + dataArray[i]);
                    }
                }
                
            } else if (dataArray[i] != null && dataArray[i].instructor != null && dataArray[i].registrations != null && dataArray[i].startsAt != null) {
                        if (dataArray[i].instructor.firstName != "Dispatch" && dataArray[i].startsAt >= currentSelectedPeriod.toISOString().slice(0, -5) && dataArray[i].startsAt < endOfPeriod.toISOString().slice(0, -5)) {
                            for (let j = 0; j < instructorList.length; j++) {
                                if (dataArray[i].instructor.firstName == instructorList[j].firstName && dataArray[i].instructor.lastName == instructorList[j].lastName) {
                                    caught = 1;
                                }
                            }

                            //console.log(dataArray[i]);

                            let max = {
                                brief: 0,
                                total: 0,
                                debrief: 0
                            }

                            for (let j = 0; j < dataArray[i].registrations.length; j++) {
                                if (dataArray[i].registrations[j].briefingSeconds > max.brief) {
                                    max.brief = dataArray[i].registrations[j].briefingSeconds;
                                }
                                if (dataArray[i].registrations[j].totalSeconds > max.total) {
                                    max.total = dataArray[i].registrations[j].totalSeconds;
                                }
                                if (dataArray[i].registrations[j].debriefingSeconds > max.debrief) {
                                    max.debrief = dataArray[i].registrations[j].debriefingSeconds;
                                }
                            }

                            if (caught == 0) {
                                instructorList.push({
                                    firstName: dataArray[i].instructor.firstName,
                                    lastName: dataArray[i].instructor.lastName,
                                    briefingSeconds: max.brief,
                                    totalSeconds: max.total,
                                    debriefingSeconds: max.debrief,
                                    reservationList: [dataArray[i]]
                                })
                            } else if (caught == 1) {
                                for (let j = 0; j < instructorList.length; j++) {
                                    if (dataArray[i].instructor.firstName == instructorList[j].firstName && dataArray[i].instructor.lastName == instructorList[j].lastName) {
                                        instructorList[j].briefingSeconds += max.brief;
                                        instructorList[j].totalSeconds += max.total;
                                        instructorList[j].debriefingSeconds += max.debrief;
                                        instructorList[j].reservationList.push(dataArray[i]);
                                    }
                                }
                            }
                        }
                    } else {
                //console.log(dataArray[i]);
            }
            
        }

        if (instructorList.length == 0) {
            instructorList.push({
                firstName: "No Entries Found",
                lastName: "",
                briefingSeconds: "",
                totalSeconds: "",
                debriefingSeconds: "",
                reservationList: []
            })
        }

        instructorList = instructorList;

        instructorList.sort(compareLast);
        instructorList.sort(compareFirst);

        filled = true;

        
        console.log(instructorList);
        //console.log(instructorList);
        //console.log(selectedPeriod);
    }
    
</script>

<head>
    <title>Hours Dashboard</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
</head>

<div class="container">

<Heading tag='h1'>Hours Dashboard</Heading>

<Hr />

<Label>
    Select Pay Period
    
    <Select class="mt-2" on:change={() => {calculate()}} items={periodArray} bind:value={selectedPeriod} />
</Label>

<!--
<div class="padding"></div>
<Button on:click={ calculate }>Submit</Button>
-->

{#if filled}
<Hr />



<Heading tag='h2'>Instructor Hours for Period</Heading>
<div class="padding"></div>
<Table hoverable={true} shadow>
    <TableHead>
        <TableHeadCell>Instructor</TableHeadCell>
        <!--  <TableHeadCell>Briefing</TableHeadCell>
        <TableHeadCell>Flight</TableHeadCell>
        <TableHeadCell>Debfiefing</TableHeadCell> -->
        <TableHeadCell>Total</TableHeadCell>
    </TableHead>
    <TableBody>
        {#each instructorList as instructor}
            <TableBodyRow>
                <TableBodyCell>{instructor.firstName} {instructor.lastName}</TableBodyCell>
                <!--  <TableBodyCell>{instructor.briefingSeconds / 60 / 60}</TableBodyCell>
                <TableBodyCell>{instructor.totalSeconds / 60 / 60}</TableBodyCell>
                <TableBodyCell>{instructor.debriefingSeconds / 60 / 60}</TableBodyCell> -->
                <TableBodyCell>{(instructor.debriefingSeconds + instructor.totalSeconds + instructor.briefingSeconds) / 60 / 60}</TableBodyCell>
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