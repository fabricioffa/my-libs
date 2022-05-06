class GridController {
    countColumns(grid) {
        const columnsNumber = window.getComputedStyle(grid)
            .getPropertyValue('grid-template-columns')
            .split(' ')
            .length;
        return columnsNumber;
    }

    countRows(grid) {
        const rowsNumber = window.getComputedStyle(grid)
            .getPropertyValue('grid-template-rows')
            .split(' ')
            .length;
        return rowsNumber;
    }

    countItems(grid) {
        const itemsNum = this.countColumns(grid) * this.countRows(grid);
        return itemsNum;
    }

    // CountColumns will return how many columns would fit the present screen size, so this number is used to set know how many items should be displayed as to display the first line only.
        // This method serves primarily for the good functioning of HideOtherRows method.

    showFirstRow(grid) {
        const gridItems = Array.from(grid.querySelectorAll('div')); // TODO: trocar por children
        const colsPerRow = this.countColumns(grid);
        const firstRowCols = gridItems.slice(0, colsPerRow);

        for (let col of firstRowCols) {
            col.style.display = 'block';
        };

        return this;
    }


    // Hides all rows but the first.

    hideOtherRows(grid) {

        // showFirstRow is called to avoid hiding items that should be in the first row in that moment

        this.showFirstRow(grid);

        if (this.countRows(grid) > 1) {
            const gridItems = Array.from(grid.querySelectorAll('div')); // TODO: trocar por children
            const colsPerRow = this.countColumns(grid);
            const otherRowsCols = gridItems.slice(colsPerRow);

            for (let col of otherRowsCols) {
                col.style.display = 'none';
            };
        }

        return this;
    }

    // Makes sure only the first row is visible and slideBtns are visible or hidden.

    formatGrids(grids) {
        grids.forEach(grid => {

            if (grid.classList.contains('intro-grid')) return;
            if (grid.classList.contains('product-grid')) return;
            this.hideOtherRows(grid)
            this.showOrHideSlideBtns(grid);

        });

        return this;
    }

    // Shows if there are hidden items, otherwise hides them.
        // The grid is used as a reference because the buttons were all put one before and the other after the grid

    showOrHideSlideBtns(grid) {
        if (this.isAllItemsVisible(grid)) {
            grid.nextElementSibling.style.display = 'none';
            grid.previousElementSibling.style.display = 'none';
            return;
        }
        grid.nextElementSibling.style.display = '';
        grid.previousElementSibling.style.display = '';
    }

    // Note that this only works after the calling of the methods that set the display attribute

    isAllItemsVisible(grid) {
        const gridItems = Array.from(grid.querySelectorAll('div'));
        const visibleItems = gridItems.filter(item => item.style.display === 'block');
        return gridItems.length === visibleItems.length;
    }

    slideGrid(grid, direction) {
        const gridItems = Array.from(grid.querySelectorAll('div'));
        const colsPerRow = this.countColumns(grid);

        const visibleItemsIndexes = [];
        let newRowIndex = [];

        // Sets visibleItemsIndexes

        gridItems.forEach((item, index) => {
            if (item.style.display === 'block') visibleItemsIndexes.push(index);
        });

        // Hides all items to give a value to its style attribute

        gridItems.forEach(item => item.style.display = 'none')

        // Right button

        if (direction === 'right') {

            // Calculates the new row indexes by adding the number of columns per row.

            newRowIndex = visibleItemsIndexes.map(item => item + colsPerRow);

            // Checks if the first index of the new row is out of range, to know if the last items displayed were the last. If so, the first row is again displayed.

            if (newRowIndex.at(0) >= gridItems.length) return this.hideOtherRows(grid);

            // Checks if the last index of the new row to be displayed passes the range of items. If so, it shows the last items of the arrays.

            if (newRowIndex.at(-1) > gridItems.length - 1) {
                gridItems.slice(-colsPerRow)
                    .forEach(item => item.style.display = 'block');

                return;
            }

            // If the new indexes are in the range, they are then displayed

            gridItems.slice(newRowIndex.at(0), newRowIndex.at(-1) + 1)
                .forEach(item => item.style.display = 'block');

            return;
        }

        // Left button.

        newRowIndex = visibleItemsIndexes.map(item => item - colsPerRow);

        // If the first index is positive and the last negative, slice returns an empty array. To avoid that, been the first negative, if the last is positive we show the first row, except if the last is zero, in which case we show the last row.

        if (newRowIndex.at(0) < 0 && (newRowIndex.at(-1) + 1) >= 0) {
            if ((newRowIndex.at(-1) + 1) === 0) {
                return gridItems.slice(newRowIndex.at(0))
                    .forEach(item => item.style.display = 'block');
            }

            this.showFirstRow(grid);

            return;
        }

        // If the indexes are in range, they are just displayed.

        return gridItems.slice(newRowIndex.at(0), newRowIndex.at(-1) + 1)
            .forEach(item => item.style.display = 'block');
    }

}

const instance = new GridController;
export default instance;