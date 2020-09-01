import * as child_process from 'child_process';

type Position = {
    width: number,
    height: number,
    xOffset: number,
    yOffset: number,
}

type RectangleSize = {
    width: number,
    height: number
}

type Output = {
    name: string,
    connected: boolean,
    position?: Position,
    size?: RectangleSize,
}

let parsePosition: (s: string) => Position = (s: string) => {
    let splitted = s.split(/[x+]/);
    return {
        width: Number(splitted[0]),
        height: Number(splitted[1]),
        xOffset: Number(splitted[2]),
        yOffset: Number(splitted[3]),
    }
}

let parseSize: (s: string) => RectangleSize = (line: string) => {
    let matched: Array<string> = line.match(/(\d+(?=mm))/g);
    return {
        width: Number(matched[0]),
        height: Number(matched[1]),
    }
}

let parseOutputLine: (s: string) => Output | null = (line: string) => {
    let splitted: Array<string> = line.split(' ').filter(s => s != '')
    if (splitted.length > 2 && (splitted[1] === 'connected' || splitted[1] === 'disconnected')) {
        let output: Output = {
            name: splitted[0],
            connected: splitted[1] === 'connected',
        }
        if (output.connected) {
            output.position = parsePosition(splitted[2]);
            output.size = parseSize(line);
        }
        return output;
    } else {
        return null;
    }
}

let getOutputs: () => Array<Output> = () => {
    let result: string = child_process.execSync('xrandr').toString();
    let lines: Array<string> = result.split('\n')
    
    let outputs = lines.map(parseOutputLine).filter(Boolean);
    return outputs;
}

let outputs = getOutputs();
console.log(outputs);
