function sortData(data) {
	const total = data.length;
	let male = 0;
	let female = 0;
	let political = 0;
	let politicalParties = {
		R: 0,
		Sv: 0,
		Ap: 0,
		Sp: 0,
		MDG: 0,
		Krf: 0,
		V: 0,
		H: 0,
		Frp: 0,
		Andre: 0,
	};
	let totalage = 0;
	let agecount = 0;
	data.forEach((p) => {
		if (p.politicalParty) {
			political++;
			politicalParties[p.politicalParty]++;
		}
		if (p.age) {
			totalage = totalage + parseInt(p.age);
			agecount++;
		}
		if (p.gender === "http://schema.org/Male") {
			male++;
		}
		if (p.gender === "http://schema.org/Female") {
			female++;
		}
	});
      return {
            total: total,
            age: parseInt(totalage / agecount),
            female: female,
            male: male,
            gendertotal: male + female,
            political: political,
            politicalParties: politicalParties,
      }
}

function getAge(bd) {
      const birthday = new Date(bd);
      var ageDifMs = Date.now() - birthday.getTime();
      var ageDate = new Date(ageDifMs); // miliseconds from epoch
      return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export { getAge, sortData };