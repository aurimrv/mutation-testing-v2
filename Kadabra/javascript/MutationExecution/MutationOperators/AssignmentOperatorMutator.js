laraImport("lara.mutation.Mutator");
laraImport("kadabra.KadabraNodes");
laraImport("weaver.Query");
laraImport("weaver.Weaver");

class AssignmentOperatorMutator extends Mutator {
    constructor(original, result) {
        super("AssignmentOperatorMutator");

        this.original = original;
        this.expr = result;
        this.mutationPoints = [];
        this.currentIndex = 0;
        this.mutationPoint = undefined;
        this.previousValue = undefined;
    }

    /*** IMPLEMENTATION OF INSTANCE METHODS ***/
    addJp(joinpoint) {
        if (
            joinpoint.instanceOf("opAssignment") &&
            joinpoint.operator === this.original
        ) {
            this.mutationPoints.push(joinpoint);
            debug(
                "Adicionou um ponto de mutação " +
                this.expr +
                " a " +
                joinpoint +
                " na linha " +
                joinpoint.line
            );
            return true;
        }
        return false;
    }

    hasMutations() {
        return this.currentIndex < this.mutationPoints.length;
    }

    getMutationPoint() {
        if (this.isMutated) {
            return this.mutationPoint;
        } else {
            if (this.currentIndex < this.mutationPoints.length) {
                return this.mutationPoints[this.currentIndex];
            } else {
                return undefined;
            }
        }
    }

    _mutatePrivate() {
        this.mutationPoint = this.mutationPoints[this.currentIndex];
        this.currentIndex++;


        this.previousValue = this.mutationPoint.operator;
        this.mutationPoint.operator = this.expr;

        println("/*--------------------------------------*/");
        println("Mutating operator n." + this.currentIndex + ": " + this.previousValue
            + " to " + this.mutationPoint);
        println("/*--------------------------------------*/");

    }

    _restorePrivate() {
        this.mutationPoint.operator = this.previousValue;
        this.previousValue = undefined;
        this.mutationPoint = undefined;
    }

    toString() {
        return `Assignment Operator from ${this.$original} to ${this.$expr}, current mutation points ${this.mutationPoints}, current mutation point ${this.mutationPoint} and previous value ${this.previousValue}`;
    }

    toJson() {
        return {
            mutationOperatorArgumentsList: [this.original, this.expr],
            operator: this.name,
        };
    }
}
