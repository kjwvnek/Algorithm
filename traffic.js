function solution(lines) {
	let trafficCount = 0;
	
	// create map
	const map = lines.map(line => {
		const timestamp = line.substring(0, line.lastIndexOf(' '));
		const startTime = new Time(timestamp);
		const endTime = new Time(timestamp);
		
		const cost = parseFloat(line.substring(line.lastIndexOf(' ') + 1, line.length - 1));
		startTime.prev(cost).next(0.001);
		
		return {
			startTime,
			endTime
		};
	});
	
	const timeMap = {};
	map.forEach(({ startTime, endTime }) => {
		const time = startTime.clone();
		const end = endTime.clone().next(0.001);
		while (!time.isTheSame(end)) {
			timeMap[time.toString()] = 0;
			time.next(0.001);
		}
	});
	
	Object.keys(timeMap).forEach(timeKey => {
		const timer = new Time(timeKey);
		const endTimer = timer.clone().next(0.999);
		
		const count = map.reduce((accum, time) => {
			const isBetween = time.startTime.isBetween(timer, endTimer) || time.endTime.isBetween(timer, endTimer);
			
			if (isBetween) {
				accum++;
			}
			
			return accum;
		}, 0);
		
		if (count > trafficCount) {
			trafficCount = count;
		}
	});
	
	return trafficCount;
}

class Time {
	constructor(format) {
		let year, month, date, hour, minute, seconds, milliseconds, sec;
		
		if (arguments.length === 1 && typeof arguments[0] === 'string') {
			const [ datestamp, timestamp ] = format.split(' ');
			[ year, month, date ] = datestamp.split('-');
			[ hour, minute, sec ] = timestamp.split(':');
			[ seconds, milliseconds ] = sec.split('.');
		} else {
			[ year, month, date, hour, minute, seconds, milliseconds ] = [ ...arguments ];
		}
		
		this._date = new Date(
			parseInt(year),
			parseInt(month) - 1,
			parseInt(date),
			parseInt(hour),
			parseInt(minute),
			parseInt(seconds),
			parseInt(milliseconds)
		);
	}
	
	get year() { return this._date.getFullYear(); }
	get month() { return this._date.getMonth() + 1; }
	get date() { return this._date.getDate(); }
	get hour() { return this._date.getHours(); }
	get minute() { return this._date.getMinutes(); }
	get seconds() { return this._date.getSeconds(); }
	get milliseconds() { return this._date.getMilliseconds(); }
	get sec() {
		const seconds = this._date.getSeconds();
		const milliseconds = parseFloat((this._date.getMilliseconds() / 1000).toFixed(3));
		
		return seconds + milliseconds;
	}
	
	prev(sec) {
		const [ seconds, milliseconds ] = sec.toString().split('.');
		
		this._date.setSeconds(this._date.getSeconds() - parseInt(seconds));
		
		if (milliseconds !== undefined) {
			this._date.setMilliseconds(this._date.getMilliseconds() - parseInt(milliseconds));
		}
		
		return this;
	}
	
	next(sec) {
		const [ seconds, milliseconds ] = sec.toString().split('.');
		
		this._date.setSeconds(this._date.getSeconds() + parseInt(seconds));
		
		if (milliseconds !== undefined) {
			this._date.setMilliseconds(this._date.getMilliseconds() + parseInt(milliseconds));
		}
		
		return this;
	}
	
	isFutureThan(time) {
		if (this.year !== time.year) {
			return this.year > time.year;
		}
		
		if (this.month !== time.month) {
			return this.month > time.month;
		}
		
		if (this.date !== time.date) {
			return this.date > time.date;
		}
		
		if (this.hour !== time.hour) {
			return this.hour > time.hour;
		}
		
		if (this.minute !== time.minute) {
			return this.minute > time.minute;
		}
		
		if (this.sec !== time.sec) {
			return this.sec > time.sec;
		}
		
		return false;
	}
	
	isBetween(start, end) {
		return this.isTheSame(start) || this.isTheSame(end) || (this.isFutureThan(start) && !this.isFutureThan(end));
	}
	
	isTheSame(time) {
		return this.year === time.year && this.month === time.month && this.date === time.date && this.hour === time.hour && this.minute === time.minute && this.sec === time.sec;
	}
	
	clone() {
		return new Time(this.year, this.month, this.date, this.hour, this.minute, this.seconds, this.milliseconds);
	}
	
	toString() {
		return `${this.year}-${this.month}-${this.date} ${this.hour}:${this.minute}:${this.sec}`
	}
}

var sol = solution(["2016-09-15 20:59:57.421 0.351s", "2016-09-15 20:59:58.233 1.181s", "2016-09-15 20:59:58.299 0.8s", "2016-09-15 20:59:58.688 1.041s", "2016-09-15 20:59:59.591 1.412s", "2016-09-15 21:00:00.464 1.466s", "2016-09-15 21:00:00.741 1.581s", "2016-09-15 21:00:00.748 2.31s", "2016-09-15 21:00:00.966 0.381s", "2016-09-15 21:00:02.066 2.62s"]);
console.log(sol);