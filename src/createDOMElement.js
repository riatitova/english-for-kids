function addChildren(children, element) {
  const currentElement = element;

  if (children && Array.isArray(children)) {
    children.forEach(childElement => childElement && currentElement.appendChild(childElement));
  } else if (children && typeof children === 'object') {
    currentElement.appendChild(children);
  } else if (children && typeof children === 'string') {
    currentElement.innerHTML = children;
  }
  return currentElement;
}

function addAttributes(element, classNames, children, parent, dataAttributes) {
  const attributeNames = /value|id|placeholder|cols|rows|src|href|alt|target/;
  let currentElement = element;

  if (classNames) {
    currentElement.classList.add(...classNames.split(' '));
  }
  currentElement = addChildren(children, currentElement);
  if (parent) {
    parent.appendChild(currentElement);
  }

  if (dataAttributes.length) {
    dataAttributes.forEach(([attributeName, attributeValue]) => {
      if (attributeNames.test(attributeName)) {
        currentElement.setAttribute(attributeName, attributeValue);
      } else {
        currentElement.dataset[attributeName] = attributeValue;
      }
    });
  }
  return currentElement;
}

export default function createDOMElement(
  elementName,
  classNames,
  children,
  parent,
  ...dataAttributes
) {
  let element = null;

  try {
    element = document.createElement(elementName);
  } catch (error) {
    throw new Error('Give a proper tag name');
  }
  element = addAttributes(
    element,
    classNames,
    children,
    parent,
    dataAttributes,
  );
  return element;
}
