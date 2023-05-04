
const test = async () => {
    //request login 
    const res = await fetch("http://localhost:3000/fetchTables", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    })

    //if it returns status 200 i.e successful redirect to calendar
    if(res.status == 200) {
        console.log("yayyy");
    } else { //if it returns any other status i.e unsuccessful redirect to login
        console.log("Boooooo")
    }
}

test()