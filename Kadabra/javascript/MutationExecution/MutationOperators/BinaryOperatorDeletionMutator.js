laraImport("lara.mutation.Mutator");
laraImport("kadabra.KadabraNodes");
laraImport("weaver.WeaverJps");
laraImport("weaver.Weaver");

class BinaryOperatorDeletionMutator extends Mutator {
    //Parent constructor
    constructor(operator) {
        super("BinaryOperatorDeletionMutator");
        this.operator = operator;
        this.newValue = undefined;
        this.mutationPoints = [];
        this.currentIndex = 0;
        this.previousValue = undefined;
        this.isFirst = false;
    }

    isAndroidSpecific() {
        return false;
    }
    addJp(joinpoint) {
        if (joinpoint.instanceOf("binaryExpression") && joinpoint.parent != undefined && joinpoint.parent.type === undefined && !joinpoint.parent.instanceOf("if") && joinpoint.operator === this.operator) {
            this.mutationPoints.push(joinpoint);

        }
        if (this.mutationPoints.length > 0) {
            return true;
        }
        return false;
    }

    /*** IMPLEMENTATION OF INSTANCE METHODS ***/
    hasMutations() {
        return this.currentIndex < this.mutationPoints.length;
    }

    getMutationPoint() {
        if (this.isMutated) {
            return this.newValue;
        } else {
            if (this.currentIndex < this.mutationPoints.length) {
                return this.mutationPoints[this.currentIndex];
            } else {
                return undefined;
            }
        }
    }

    _mutatePrivate() {

        let mutationPoint = this.mutationPoints[this.currentIndex];

        this.previousValue = mutationPoint;

        if (this.isFirst === false) {
            let leftOperand = mutationPoint.lhs.copy();
            this.newValue = mutationPoint.insertReplace(leftOperand);
            this.isFirst = true;
        }
        else {
            let rightOperand = mutationPoint.rhs.copy();
            this.newValue = mutationPoint.insertReplace(rightOperand);
            this.isFirst = false;
            this.currentIndex++;
        }


        println("/*--------------------------------------*/");
        println("Mutating operator n." + this.currentIndex + ": " + this.previousValue
            + " to " + this.newValue);
        println("/*--------------------------------------*/");

    }
    _restorePrivate() {
        // Restore operator
        println("Restore  prev: " + this.previousValue.code);
        println("Restore new: " + this.newValue.code);
        this.newValue.insertReplace(this.previousValue);
        this.previousValue = undefined;
        this.newValue = undefined;
    }

    toString() {
        return `Binary Operator Deletion Mutator from ${this.previousValue} to ${this.newValue}, current mutation points ${this.mutationPoints}, current mutation point ${this.mutationPoint} and previous value ${this.previousValue}`;
    }
    toJson() {
        return {
            mutationOperatorArgumentsList: [],
            operator: this.name,
            isAndroidSpecific: this.isAndroidSpecific(),
        };
    }
}
