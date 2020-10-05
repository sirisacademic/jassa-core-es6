import Class from '../../ext/Class';
import Iterator from './Iterator';

var IteratorAbstract = Class.create(Iterator, {
    initialize: function() {
        this.current = null;
        this.advance = true;
        this.finished = false;
    },

    finish: function() {
        this.finished = true;

        this.close();
        return null;
    },

    $prefetch: function() {
        this.current = this.prefetch();
    },

    hasNext: function() {
        if (this.advance) {
            this.$prefetch();
            this.advance = false;
        }

        return this.finished === false;
    },

    next: function() {
        if (this.finished) {
            throw new Error('No more elments');
        }

        if (this.advance) {
            this.$prefetch();
        }

        this.advance = true;
        return this.current;
    },

    prefetch: function() {
        throw new Error('Not overridden');
    }
});

export default IteratorAbstract;
