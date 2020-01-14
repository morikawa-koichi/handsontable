
import {
  outerHeight,
  outerWidth,
  setOverlayPosition,
  resetCssTransform
} from './../../../../helpers/dom/element';
import TopLeftCornerOverlayTable from './../table/topLeftCorner';
import Overlay from './_base';

/**
 * @class TopLeftCornerOverlay
 */
class TopLeftCornerOverlay extends Overlay {
  /**
   * @param {Walkontable} wotInstance
   */
  constructor(wotInstance) {
    super(wotInstance);
    this.clone = this.makeClone(Overlay.CLONE_TOP_LEFT_CORNER);
    this.updateStateOfRendering();
  }

  /**
   * Factory method to create a subclass of `Table` that is relevant to this overlay.
   *
   * @see Table#constructor
   * @param {...*} args Parameters that will be forwarded to the `Table` constructor
   * @returns {Table}
   */
  createTable(...args) {
    return new TopLeftCornerOverlayTable(...args);
  }

  /**
   * Checks if overlay should be fully rendered
   *
   * @returns {Boolean}
   */
  shouldBeRendered() {
    const { master } = this;
    return !!((master.getSetting('fixedRowsTop') || master.getSetting('columnHeaders').length) &&
        (master.getSetting('fixedColumnsLeft') || master.getSetting('rowHeaders').length));
  }

  /**
   * Updates the position of the overlay root element relatively to the position of the master instance
   */
  adjustElementsPosition() {
    const { clone, master } = this;

    if (!master.wtTable.holder.parentNode) {
      // removed from DOM
      return;
    }
    const overlayRootElement = clone.wtTable.wtRootElement;
    const preventOverflow = master.getSetting('preventOverflow');

    if (master.wtTable.trimmingContainer === master.rootWindow) {
      const box = master.wtTable.hider.getBoundingClientRect();
      const top = Math.ceil(box.top);
      const left = Math.ceil(box.left);
      const bottom = Math.ceil(box.bottom);
      const right = Math.ceil(box.right);
      let finalLeft = '0';
      let finalTop = '0';

      if (!preventOverflow || preventOverflow === 'vertical') {
        if (left < 0 && (right - overlayRootElement.offsetWidth) > 0) {
          finalLeft = `${-left}px`;
        }
      }

      if (!preventOverflow || preventOverflow === 'horizontal') {
        if (top < 0 && (bottom - overlayRootElement.offsetHeight) > 0) {
          finalTop = `${-top}px`;
        }
      }
      setOverlayPosition(overlayRootElement, finalLeft, finalTop);
    } else {
      resetCssTransform(overlayRootElement);
    }
  }

  /**
   * If needed, adjust the sizes of the clone and the master elements to the dimensions of the trimming container.
   *
   * @param {Boolean} [force=false]
   */
  adjustElementsSize(force = false) {
    if (!this.needFullRender && !force) {
      return;
    }

    const { clone, master } = this;
    let tableHeight = outerHeight(clone.wtTable.TABLE) - 1;
    const tableWidth = outerWidth(clone.wtTable.TABLE) - 1;
    const overlayRootElement = clone.wtTable.wtRootElement;

    if (!master.wtTable.hasDefinedSize()) {
      tableHeight = 0;
    }

    overlayRootElement.style.height = `${tableHeight}px`;
    overlayRootElement.style.width = `${tableWidth}px`;
    clone.wtTable.holder.style.height = overlayRootElement.style.height;
    clone.wtTable.holder.style.width = overlayRootElement.style.width;
  }
}

Overlay.registerOverlay(Overlay.CLONE_TOP_LEFT_CORNER, TopLeftCornerOverlay);

export default TopLeftCornerOverlay;
