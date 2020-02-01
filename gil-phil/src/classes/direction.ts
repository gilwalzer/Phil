export enum DirectionType
{
    ACROSS = 1,
    DOWN
}

export class Direction 
{
    currentDirection: DirectionType;

    constructor(direction: DirectionType) 
    {
        this.currentDirection = direction;
    }

    getOppositeDirection() 
    {
        if (this.isAcross()) 
        {
            return new Direction(DirectionType.DOWN);
        }
        else
        {
            return new Direction(DirectionType.ACROSS);
        }
    }

    isAcross() 
    {
        return this.currentDirection === DirectionType.ACROSS;
    }

    isDown() 
    {
        return this.currentDirection === DirectionType.DOWN;
    }

    toString()
    {
        return this.isAcross() ? "across" : "down";
    }

    static getTypeAsLetter(directionType: DirectionType)
    {
        return new Direction(directionType).toString().charAt(0) 
    }
}