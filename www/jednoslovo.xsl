<?xml version="1.0" encoding="utf-8"  ?> 
<xsl:stylesheet   version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/TR/REC-html40"
    xmlns:svg="http://www.w3.org/2000/svg"    

>
<xsl:output method="html" encoding="utf-8" /> 

<xsl:param name = "param1" >Neni Parametr </xsl:param>

<xsl:variable name="today" select="//ORIGIN/DATE" />

 <!--                 nezobrazovane udaje                 -->
<xsl:template match="text()"/>
 
	 
 <xsl:template match="/">
  <xsl:variable name="slovo" select="//R[position()=$param1]" />
 
<div id="tabs-0" class="tab"> 

   <div id="Word1"> <xsl:value-of select="$slovo/W1"/></div>
   <div id="Word2"> <xsl:value-of select="$slovo/V[1]/W2" /> </div>
 
</div>   

</xsl:template>


 </xsl:stylesheet>
