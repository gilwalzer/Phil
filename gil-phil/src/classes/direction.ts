export class Direction 
{
    currentDirection: string;

    constructor(direction: string) 
    {
        if (direction === "across") 
        {
            this.currentDirection = "across";
        }
        else if (direction === "down") 
        {
            this.currentDirection = "down";
        }
        else { 
            throw new Error("invalid initial direction " + direction);
        }
    }

    getOppositeDirection() 
    {
        if (this.isAcross()) 
        {
            return new Direction("down");
        }
        else
        {
            return new Direction("across");
        }
    }

    isAcross() 
    {
        return this.currentDirection === "across";
    }

    isDown() 
    {
        return this.currentDirection === "down";
    }
}